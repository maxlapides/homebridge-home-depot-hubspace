import { FunctionCharacteristic } from './function-characteristic';
/**
 * Device function
 */
export interface DeviceFunction {
    /**
     * Homebridge characteristic for the function
     */
    characteristic: FunctionCharacteristic;
    /**
     * Function instance
     * (this could be set by the API if there are multiple instance for single characteristic)
     */
    functionInstance?: string;
    /**
     * API attribute ID
     */
    attributeId: string;
}
/**
 * Function that indicates NULL function
 */
export declare const NoDeviceFunction: DeviceFunction;
/**
 * Checks whether function is {@link NoDeviceFunction}
 * @param deviceFunction Function to check
 * @returns True if function is NULL function
 */
export declare function isNoFunction(deviceFunction: DeviceFunction): boolean;
//# sourceMappingURL=device-function.d.ts.map