"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNoFunction = exports.NoDeviceFunction = void 0;
const function_characteristic_1 = require("./function-characteristic");
/**
 * Function that indicates NULL function
 */
exports.NoDeviceFunction = {
    characteristic: function_characteristic_1.FunctionCharacteristic.None,
    attributeId: ''
};
/**
 * Checks whether function is {@link NoDeviceFunction}
 * @param deviceFunction Function to check
 * @returns True if function is NULL function
 */
function isNoFunction(deviceFunction) {
    const noFcKeys = Object.keys(exports.NoDeviceFunction);
    const fcToCheckKeys = Object.keys(deviceFunction);
    if (noFcKeys.length !== fcToCheckKeys.length)
        return false;
    for (const key of noFcKeys) {
        if (noFcKeys[key] !== fcToCheckKeys[key])
            return false;
    }
    return true;
}
exports.isNoFunction = isNoFunction;
//# sourceMappingURL=device-function.js.map