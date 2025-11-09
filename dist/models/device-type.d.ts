/**
 * Type of a device
 */
export declare enum DeviceType {
    None = "none",
    Light = "light",
    Fan = "fan",
    Outlet = "power-outlet",
    Switch = "switch"
}
/**
 * Gets {@link DeviceType} for a specific key
 * @param key Device key
 * @returns {@link DeviceType} if key is found otherwise undefined
 */
export declare function getDeviceTypeForKey(key: string): DeviceType;
//# sourceMappingURL=device-type.d.ts.map