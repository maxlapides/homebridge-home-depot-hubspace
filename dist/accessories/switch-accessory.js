"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchAccessory = void 0;
const function_characteristic_1 = require("../models/function-characteristic");
const utils_1 = require("../utils");
const hubspace_accessory_1 = require("./hubspace-accessory");
class SwitchAccessory extends hubspace_accessory_1.HubspaceAccessory {
    constructor(platform, accessory) {
        super(platform, accessory, platform.Service.Switch);
        this.configurePower();
    }
    configurePower() {
        if (this.supportsCharacteristic(function_characteristic_1.FunctionCharacteristic.Power)) {
            this.service.getCharacteristic(this.platform.Characteristic.On)
                .onGet(this.getOn.bind(this))
                .onSet(this.setOn.bind(this));
        }
    }
    async getOn() {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.Power);
        const value = await this.deviceService.getValueAsBoolean(this.device.deviceId, deviceFc);
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        return value;
    }
    async setOn(value) {
        const deviceFc = this.getFunctionForCharacteristics(function_characteristic_1.FunctionCharacteristic.Power);
        await this.deviceService.setValue(this.device.deviceId, deviceFc, value);
    }
}
exports.SwitchAccessory = SwitchAccessory;
//# sourceMappingURL=switch-accessory.js.map