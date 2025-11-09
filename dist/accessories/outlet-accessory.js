"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletAccessory = void 0;
const function_characteristic_1 = require("../models/function-characteristic");
const utils_1 = require("../utils");
const hubspace_accessory_1 = require("./hubspace-accessory");
class OutletAccessory extends hubspace_accessory_1.HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform, accessory) {
        super(platform, accessory, platform.Service.Outlet);
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
}
exports.OutletAccessory = OutletAccessory;
//# sourceMappingURL=outlet-accessory.js.map