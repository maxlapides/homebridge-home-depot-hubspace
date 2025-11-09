import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
/**
 * Service for discovering and managing devices
 */
export declare class DiscoveryService {
    private readonly _platform;
    private readonly _httpClient;
    private _cachedAccessories;
    constructor(_platform: HubspacePlatform);
    /**
     * Receives accessory that has been cached by Homebridge
     * @param accessory Cached accessory
     */
    configureCachedAccessory(accessory: PlatformAccessory): void;
    /**
     * Discovers new devices
     */
    discoverDevices(): Promise<void>;
    private clearStaleAccessories;
    private registerCachedAccessory;
    private registerNewAccessory;
    private getDevicesForAccount;
    private mapDeviceResponseToModel;
    /**
     * Gets all functions that are supported (have been implemented) by the plugin
     * @param deviceDef Homebridge device definition
     * @param deviceFunctionResponse Hubspace device server response
     * @returns All functions from the response that are supported by the Homebridge device
     */
    private findSupportedFunctionsForDevice;
    /**
     * Generates UUID from a seed value
     * @param value Value to use for UUID seed
     * @param generations How many times to run the generation algorithm
     * @returns UUID
     */
    private generatedUuid;
    private mapToFunction;
}
//# sourceMappingURL=discovery.service.d.ts.map