"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const device_accessory_factory_1 = require("../accessories/device-accessory-factory");
const endpoints_1 = require("../api/endpoints");
const http_client_factory_1 = require("../api/http-client-factory");
const hubspace_devices_1 = require("../hubspace-devices");
const device_type_1 = require("../models/device-type");
const settings_1 = require("../settings");
/**
 * Service for discovering and managing devices
 */
class DiscoveryService {
    constructor(_platform) {
        this._platform = _platform;
        this._httpClient = (0, http_client_factory_1.createHttpClientWithBearerInterceptor)({
            baseURL: endpoints_1.Endpoints.API_BASE_URL,
            headers: {
                host: 'semantics2.afero.net'
            }
        });
        this._cachedAccessories = [];
    }
    /**
     * Receives accessory that has been cached by Homebridge
     * @param accessory Cached accessory
     */
    configureCachedAccessory(accessory) {
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this._cachedAccessories.push(accessory);
    }
    /**
     * Discovers new devices
     */
    async discoverDevices() {
        const devices = await this.getDevicesForAccount();
        // loop over the discovered devices and register each one if it has not already been registered
        for (const device of devices) {
            // see if an accessory with the same uuid has already been registered and restored from
            // the cached devices we stored in the `configureAccessory` method above
            const existingAccessory = this._cachedAccessories.find(accessory => accessory.UUID === device.uuid);
            if (existingAccessory) {
                // the accessory already exists
                this._platform.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
                this.registerCachedAccessory(existingAccessory, device);
            }
            else {
                // the accessory does not yet exist, so we need to create it
                this._platform.log.info('Adding new accessory:', device.name);
                this.registerNewAccessory(device);
            }
        }
        this.clearStaleAccessories(this._cachedAccessories.filter(a => !devices.some(d => d.uuid === a.UUID)));
    }
    clearStaleAccessories(staleAccessories) {
        // Unregister them
        this._platform.api.unregisterPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, staleAccessories);
        // Clear the cache array to reflect this change
        for (const accessory of staleAccessories) {
            const cacheIndex = this._cachedAccessories.findIndex(a => a.UUID === accessory.UUID);
            if (cacheIndex < 0)
                continue;
            this._cachedAccessories.splice(cacheIndex, 1);
        }
    }
    registerCachedAccessory(accessory, device) {
        accessory.context.device = device;
        this._platform.api.updatePlatformAccessories([accessory]);
        (0, device_accessory_factory_1.createAccessoryForDevice)(device, this._platform, accessory);
    }
    registerNewAccessory(device) {
        const accessory = new this._platform.api.platformAccessory(device.name, device.uuid);
        accessory.context.device = device;
        (0, device_accessory_factory_1.createAccessoryForDevice)(device, this._platform, accessory);
        this._platform.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
    }
    async getDevicesForAccount() {
        try {
            const response = await this._httpClient
                .get(`accounts/${this._platform.accountService.accountId}/metadevices`);
            // Get only leaf devices with type of 'device'
            return response.data
                .filter(d => d.children.length === 0 && d.typeId === 'metadevice.device')
                .map(this.mapDeviceResponseToModel.bind(this))
                .filter(d => d.length > 0)
                .flat();
        }
        catch (ex) {
            this._platform.log.error('Failed to get devices for account.', ex.message);
            return [];
        }
    }
    mapDeviceResponseToModel(response) {
        var _a;
        const type = (0, device_type_1.getDeviceTypeForKey)(response.description.device.deviceClass);
        const deviceDef = hubspace_devices_1.Devices.find(d => d.deviceType === type);
        if (!deviceDef) {
            const metadata = JSON.stringify({
                id: response.id,
                deviceId: response.deviceId,
                friendlyName: response.friendlyName,
                typeId: response.typeId,
                deviceClass: response.description.device.deviceClass,
                manufacturer: response.description.device.manufacturerName,
                model: response.description.device.model,
                functions: response.description.functions
            }, null, 2);
            this._platform.log.warn(`Discovered unsupported Hubspace device.\n${metadata}`);
            return [];
        }
        const supportedFunctions = this.findSupportedFunctionsForDevice(deviceDef, response.description.functions);
        const devices = [];
        for (const supportedFc of supportedFunctions) {
            // Try to find a device that does NOT contain the same characteristic
            const exisingDevice = devices.find(d => !d.functions.some(df => df.characteristic === supportedFc.characteristic));
            // If the device already exists then just add the function to it
            if (exisingDevice) {
                exisingDevice.functions.push(supportedFc);
            }
            else {
                // Otherwise create a new device for it
                const defaultName = response.friendlyName;
                const nameQualifier = (_a = supportedFc.functionInstance) !== null && _a !== void 0 ? _a : devices.length;
                const newName = devices.some(d => d.name === defaultName) ? `${defaultName} (${nameQualifier})` : defaultName;
                // Make sure UUID is generated as many times as there are 'virtual' devices for each device
                // because they all have the same device ID
                devices.push({
                    uuid: this.generatedUuid(response.id, devices.length + 1),
                    deviceId: response.deviceId,
                    name: newName,
                    type: type,
                    manufacturer: response.description.device.manufacturerName,
                    model: response.description.device.model.split(',').map(m => m.trim()),
                    functions: [supportedFc]
                });
            }
        }
        return devices;
    }
    /**
     * Gets all functions that are supported (have been implemented) by the plugin
     * @param deviceDef Homebridge device definition
     * @param deviceFunctionResponse Hubspace device server response
     * @returns All functions from the response that are supported by the Homebridge device
     */
    findSupportedFunctionsForDevice(deviceDef, deviceFunctionResponse) {
        const supportedFunctions = [];
        for (const fc of deviceDef.functions) {
            const deviceFunctions = deviceFunctionResponse.filter(df => df.functionClass === fc.functionClass);
            if (deviceFunctions.length === 0)
                continue;
            for (const deviceFc of deviceFunctions) {
                const functionModel = this.mapToFunction(fc, deviceFc);
                supportedFunctions.push(functionModel);
            }
        }
        return supportedFunctions;
    }
    /**
     * Generates UUID from a seed value
     * @param value Value to use for UUID seed
     * @param generations How many times to run the generation algorithm
     * @returns UUID
     */
    generatedUuid(value, generations = 1) {
        for (let i = 0; i < generations; i++) {
            value = this._platform.api.hap.uuid.generate(value);
        }
        return value;
    }
    mapToFunction(functionDef, functionResponse) {
        return {
            characteristic: functionDef.characteristic,
            functionInstance: functionResponse.functionInstance,
            attributeId: functionResponse.values[0].deviceValues[0].key
        };
    }
}
exports.DiscoveryService = DiscoveryService;
//# sourceMappingURL=discovery.service.js.map