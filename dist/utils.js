"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNumberToHex = exports.isNullOrUndefined = void 0;
/**
 * Checks whether at least one value is null or undefined
 * @param values Values to check
 * @returns True if any value is null or undefined otherwise false
 */
function isNullOrUndefined(...values) {
    return values.some(v => v === undefined || v === null);
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Converts a decimal number to hexadecimal
 * @param number Number to convert to hexadecimal
 */
function convertNumberToHex(value) {
    const hexValue = value.toString(16);
    return hexValue.length % 2 ? '0' + hexValue : hexValue;
}
exports.convertNumberToHex = convertNumberToHex;
//# sourceMappingURL=utils.js.map