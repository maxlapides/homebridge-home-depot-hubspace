"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspaceAccessory = void 0;
const device_function_1 = require("../models/device-function");
/**
 * Base class for Hubspace accessories
 */
class HubspaceAccessory {
    /**
     * Crates new instance of {@link HubspaceAccessory}
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     * @param service Service type for accessory
     */
    constructor(platform, accessory, service) {
        var _a, _b;
        this.platform = platform;
        this.accessory = accessory;
        this.service = accessory.getService(service) || this.accessory.addService(service);
        this.log = platform.log;
        this.deviceService = platform.deviceService;
        this.device = accessory.context.device;
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, (_a = this.device.manufacturer) !== null && _a !== void 0 ? _a : 'N/A')
            .setCharacteristic(this.platform.Characteristic.Model, this.device.model.length > 0 ? this.device.model[0] : 'N/A')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, (_b = this.device.deviceId) !== null && _b !== void 0 ? _b : 'N/A');
    }
    /**
     * Tries to get a device function for characteristic
     * @param characteristic Characteristic for function
     * @returns Found device function or {@link NoDeviceFunction}
     */
    getFunctionForCharacteristics(characteristic) {
        const fc = this.device.functions.find(f => f.characteristic === characteristic);
        if (!fc) {
            this.platform.log.error(`Failed get function for ${characteristic} it was not defined for device ${this.device.deviceId}.`);
            return device_function_1.NoDeviceFunction;
        }
        return fc;
    }
    /**
     * Checks whether function is supported by device
     * @param characteristic Function to check
     * @returns True if function is supported by the device otherwise false
     */
    supportsCharacteristic(characteristic) {
        return this.device.functions.some(fc => fc.characteristic === characteristic);
    }
    /**
     * throws {@link SERVICE_COMMUNICATION_FAILURE} exception
     */
    setNotResponding() {
        throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
    }
}
exports.HubspaceAccessory = HubspaceAccessory;
//# sourceMappingURL=hubspace-accessory.js.map