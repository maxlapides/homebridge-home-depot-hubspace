import { Logger, PlatformAccessory, Service, WithUUID } from 'homebridge';
import { Device } from '../models/device';
import { DeviceFunction } from '../models/device-function';
import { FunctionCharacteristic } from '../models/function-characteristic';
import { HubspacePlatform } from '../platform';
import { DeviceService } from '../services/device.service';
/**
 * Base class for Hubspace accessories
 */
export declare abstract class HubspaceAccessory {
    protected readonly platform: HubspacePlatform;
    protected readonly accessory: PlatformAccessory;
    /**
     * Accessory service
     */
    protected readonly service: Service;
    /**
     * Application logger
     */
    protected readonly log: Logger;
    /**
     * Device interaction service
     */
    protected readonly deviceService: DeviceService;
    /**
     * Device information
     */
    protected readonly device: Device;
    /**
     * Crates new instance of {@link HubspaceAccessory}
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     * @param service Service type for accessory
     */
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory, service: WithUUID<typeof Service> | Service);
    /**
     * Tries to get a device function for characteristic
     * @param characteristic Characteristic for function
     * @returns Found device function or {@link NoDeviceFunction}
     */
    protected getFunctionForCharacteristics(characteristic: FunctionCharacteristic): DeviceFunction;
    /**
     * Checks whether function is supported by device
     * @param characteristic Function to check
     * @returns True if function is supported by the device otherwise false
     */
    protected supportsCharacteristic(characteristic: FunctionCharacteristic): boolean;
    /**
     * throws {@link SERVICE_COMMUNICATION_FAILURE} exception
     */
    protected setNotResponding(): never;
}
//# sourceMappingURL=hubspace-accessory.d.ts.map