import { CharacteristicValue } from 'homebridge';
import { DeviceFunction } from '../models/device-function';
import { HubspacePlatform } from '../platform';
/**
 * Service for interacting with devices
 */
export declare class DeviceService {
    private readonly _platform;
    private readonly _httpClient;
    constructor(_platform: HubspacePlatform);
    /**
     * Sets an attribute value for a device
     * @param deviceId ID of a device
     * @param deviceFunction Function to set value for
     * @param value Value to set to attribute
     */
    setValue(deviceId: string, deviceFunction: DeviceFunction, value: CharacteristicValue): Promise<void>;
    /**
     * Gets a value for attribute
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Data value
     */
    getValue(deviceId: string, deviceFunction: DeviceFunction): Promise<CharacteristicValue | undefined>;
    /**
     * Gets a value for attribute as boolean
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Boolean value
     */
    getValueAsBoolean(deviceId: string, deviceFunction: DeviceFunction): Promise<boolean | undefined>;
    /**
     * Gets a value for attribute as integer
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Integer value
     */
    getValueAsInteger(deviceId: string, deviceFunction: DeviceFunction): Promise<number | undefined>;
    getValueAsString(deviceId: string, deviceFunction: DeviceFunction): Promise<string>;
    private getDataValue;
    private handleError;
}
//# sourceMappingURL=device.service.d.ts.map