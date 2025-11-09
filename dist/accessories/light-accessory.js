"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightAccessory = void 0;
const color_convert_1 = __importDefault(require("color-convert"));
const function_characteristic_1 = require("../models/function-characteristic");
const utils_1 = require("../utils");
const hubspace_accessory_1 = require("./hubspace-accessory");
/**
 * Light accessory for Hubspace platform
 */
class LightAccessory extends hubspace_accessory_1.HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform, accessory) {
        super(platform, accessory, platform.Service.Lightbulb);
        /**
         * Color information for lights that support RGB
         */
        this._lightColor = {};
        this.configurePower();
        this.configureBrightness();
        this.configureColorRgb();
    }
    configurePower() {
        this.service.getCharacteristic(this.platform.Characteristic.On)
            .onGet(this.getOn.bind(this))
            .onSet(this.setOn.bind(this));
    }
    configureBrightness() {
        if (!this.supportsCharacteristic(function_characteristic_1.FunctionCharacteristic.Brightness))
            return;
        this.service.getCharacteristic(this.platform.Characteristic.Brightness)
            .onGet(this.getBrightness.bind(this))
            .onSet(this.setBrightness.bind(this));
    }
    configureColorRgb() {
        if (!this.supportsCharacteristic(function_characteristic_1.FunctionCharacteristic.ColorRgb))
            return;
        this.service.getCharacteristic(this.platform.Characteristic.Hue)
            .onGet(this.getHue.bind(this))
            .onSet(this.setHue.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.Saturation)
            .onGet(this.getSaturation.bind(this))
            .onSet(this.setSaturation.bind(this));
    }
    async getHue() {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.ColorRgb);
        // Try to get the value
        const value = await this.deviceService.getValueAsString(this.device.deviceId, deviceFc);
        // If the value is not defined then show 'Not Responding'
        if (!value) {
            this.setNotResponding();
        }
        const color = color_convert_1.default.hex.hsl(value);
        return color[0];
    }
    async setHue(value) {
        this._lightColor.hue = value;
        if (this.isColorDefined()) {
            await this.setRgbColor(this._lightColor.hue, this._lightColor.saturation);
            this.resetColor();
        }
    }
    async getSaturation() {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.ColorRgb);
        // Try to get the value
        const value = await this.deviceService.getValueAsString(this.device.deviceId, deviceFc);
        // If the value is not defined then show 'Not Responding'
        if (!value) {
            this.setNotResponding();
        }
        const color = color_convert_1.default.hex.hsl(value);
        return color[1];
    }
    async setSaturation(value) {
        this._lightColor.saturation = value;
        if (this.isColorDefined()) {
            await this.setRgbColor(this._lightColor.hue, this._lightColor.saturation);
            this.resetColor();
        }
    }
    async getOn() {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.Power);
        // Try to get the value
        const value = await this.deviceService.getValueAsBoolean(this.device.deviceId, deviceFc);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        // Otherwise return the value
        return value;
    }
    async setOn(value) {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.Power);
        await this.deviceService.setValue(this.device.deviceId, deviceFc, value);
    }
    async getBrightness() {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.Brightness);
        // Try to get the value
        const value = await this.deviceService.getValueAsInteger(this.device.deviceId, deviceFc);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value) || value === -1) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        // Otherwise return the value
        return value;
    }
    async setBrightness(value) {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.Brightness);
        this.deviceService.setValue(this.device.deviceId, deviceFc, value);
    }
    setRgbColor(hue, saturation) {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.ColorRgb);
        const hexValue = color_convert_1.default.hsv.hex([hue, saturation, 100]);
        return this.deviceService.setValue(this.device.deviceId, deviceFc, hexValue);
    }
    resetColor() {
        this._lightColor.hue = undefined;
        this._lightColor.saturation = undefined;
    }
    isColorDefined() {
        return !(0, utils_1.isNullOrUndefined)(this._lightColor.hue) && !(0, utils_1.isNullOrUndefined)(this._lightColor.saturation);
    }
}
exports.LightAccessory = LightAccessory;
//# sourceMappingURL=light-accessory.js.map