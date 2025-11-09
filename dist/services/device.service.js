"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const endpoints_1 = require("../api/endpoints");
const http_client_factory_1 = require("../api/http-client-factory");
const device_function_1 = require("../models/device-function");
const afero_error_response_1 = require("../responses/afero-error-response");
const utils_1 = require("../utils");
/**
 * Service for interacting with devices
 */
class DeviceService {
    constructor(_platform) {
        this._platform = _platform;
        this._httpClient = (0, http_client_factory_1.createHttpClientWithBearerInterceptor)({
            baseURL: endpoints_1.Endpoints.API_BASE_URL
        });
    }
    /**
     * Sets an attribute value for a device
     * @param deviceId ID of a device
     * @param deviceFunction Function to set value for
     * @param value Value to set to attribute
     */
    async setValue(deviceId, deviceFunction, value) {
        let response;
        if ((0, device_function_1.isNoFunction)(deviceFunction)) {
            throw new this._platform.api.hap.HapStatusError(-70402 /* this._platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        try {
            response = await this._httpClient.post(`accounts/${this._platform.accountService.accountId}/devices/${deviceId}/actions`, {
                type: 'attribute_write',
                attrId: deviceFunction.attributeId,
                data: this.getDataValue(value)
            });
        }
        catch (ex) {
            this.handleError(ex);
            return;
        }
        if (response.status === 200)
            return;
        this._platform.log.error(`Remote server did not accept new value ${value} for device (ID: ${deviceId}).`);
    }
    /**
     * Gets a value for attribute
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Data value
     */
    async getValue(deviceId, deviceFunction) {
        let deviceStatus;
        if ((0, device_function_1.isNoFunction)(deviceFunction)) {
            throw new this._platform.api.hap.HapStatusError(-70402 /* this._platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        try {
            const response = await this._httpClient
                .get(`accounts/${this._platform.accountService.accountId}/devices/${deviceId}?expansions=attributes`);
            deviceStatus = response.data;
        }
        catch (ex) {
            this.handleError(ex);
            return undefined;
        }
        const attributeResponse = deviceStatus.attributes.find(a => a.id.toString() === deviceFunction.attributeId);
        if (!attributeResponse) {
            this._platform.log.error(`Failed to find value for ${deviceFunction.characteristic} for device (device ID: ${deviceId})`);
            return undefined;
        }
        return attributeResponse.value;
    }
    /**
     * Gets a value for attribute as boolean
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Boolean value
     */
    async getValueAsBoolean(deviceId, deviceFunction) {
        const value = await this.getValue(deviceId, deviceFunction);
        if (!value)
            return undefined;
        return value === '1';
    }
    /**
     * Gets a value for attribute as integer
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Integer value
     */
    async getValueAsInteger(deviceId, deviceFunction) {
        const value = await this.getValue(deviceId, deviceFunction);
        if (!value || typeof value !== 'string')
            return undefined;
        const numberValue = Number.parseInt(value);
        return Number.isNaN(numberValue) ? undefined : numberValue;
    }
    async getValueAsString(deviceId, deviceFunction) {
        const value = await this.getValue(deviceId, deviceFunction);
        return !value || typeof value !== 'string' ? '' : value;
    }
    getDataValue(value) {
        if (typeof value === 'boolean') {
            return value ? '01' : '00';
        }
        if (typeof value === 'number') {
            return (0, utils_1.convertNumberToHex)(value);
        }
        if (typeof value === 'string') {
            return value;
        }
        throw new Error('The value type is not supported.');
    }
    handleError(error) {
        var _a;
        const responseData = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
        const errorMessage = (0, afero_error_response_1.isAferoError)(responseData) ? responseData.error_description : error.message;
        this._platform.log.error('The remote service returned an error.', errorMessage);
    }
}
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map