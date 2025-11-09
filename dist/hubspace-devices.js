"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Devices = void 0;
const device_type_1 = require("./models/device-type");
const function_characteristic_1 = require("./models/function-characteristic");
/**
 * Supported Hubspace devices and implemented functions
 */
exports.Devices = [
    {
        deviceClass: 'fan',
        deviceType: device_type_1.DeviceType.Fan,
        functions: [
            {
                functionClass: 'power',
                characteristic: function_characteristic_1.FunctionCharacteristic.Power
            },
            {
                functionClass: 'fan-speed',
                characteristic: function_characteristic_1.FunctionCharacteristic.FanSpeed
            }
        ]
    },
    {
        deviceClass: 'light',
        deviceType: device_type_1.DeviceType.Light,
        functions: [
            {
                functionClass: 'power',
                characteristic: function_characteristic_1.FunctionCharacteristic.Power
            },
            {
                functionClass: 'brightness',
                characteristic: function_characteristic_1.FunctionCharacteristic.Brightness
            },
            {
                functionClass: 'color-rgb',
                characteristic: function_characteristic_1.FunctionCharacteristic.ColorRgb
            }
        ]
    },
    {
        deviceClass: 'power-outlet',
        deviceType: device_type_1.DeviceType.Outlet,
        functions: [
            {
                functionClass: 'power',
                characteristic: function_characteristic_1.FunctionCharacteristic.Power
            },
            {
                functionClass: 'toggle',
                characteristic: function_characteristic_1.FunctionCharacteristic.Power
            }
        ]
    },
    {
        deviceClass: 'switch',
        deviceType: device_type_1.DeviceType.Switch,
        functions: [
            {
                functionClass: 'power',
                characteristic: function_characteristic_1.FunctionCharacteristic.Power
            }
        ]
    },
    {
        deviceClass: 'glass-door',
        deviceType: device_type_1.DeviceType.Switch,
        functions: [
            {
                functionClass: 'power',
                characteristic: function_characteristic_1.FunctionCharacteristic.Power
            }
        ]
    }
];
//# sourceMappingURL=hubspace-devices.js.map