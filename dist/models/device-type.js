"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceTypeForKey = exports.DeviceType = void 0;
/**
 * Type of a device
 */
var DeviceType;
(function (DeviceType) {
    DeviceType["None"] = "none";
    DeviceType["Light"] = "light";
    DeviceType["Fan"] = "fan";
    DeviceType["Outlet"] = "power-outlet";
    DeviceType["Switch"] = "switch";
})(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
/**
 * Gets {@link DeviceType} for a specific key
 * @param key Device key
 * @returns {@link DeviceType} if key is found otherwise undefined
 */
function getDeviceTypeForKey(key) {
    switch (key) {
        case 'light':
            return DeviceType.Light;
        case 'fan':
            return DeviceType.Fan;
        case 'power-outlet':
            return DeviceType.Outlet;
        case 'switch':
            return DeviceType.Switch;
        case 'glass-door':
            return DeviceType.Switch;
        default:
            return DeviceType.None;
    }
}
exports.getDeviceTypeForKey = getDeviceTypeForKey;
//# sourceMappingURL=device-type.js.map