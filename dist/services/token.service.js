"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const axios_1 = __importDefault(require("axios"));
const endpoints_1 = require("../api/endpoints");
/**
 * Service for managing JWT tokens
 */
class TokenService {
    /**
     * Creates a new instance of token service
     */
    constructor() {
        this.loginBuffer = 60;
        this._httpClient = axios_1.default.create({ baseURL: endpoints_1.Endpoints.ACCOUNT_BASE_URL });
        this._username = '';
        this._password = '';
    }
    /**
     * Initializes {@link TokenService}
     * @param username Account username
     * @param password Account password
     */
    login(username, password) {
        this._username = username;
        this._password = password;
    }
    async getToken() {
        if (!this.hasValidToken()) {
            await this.authenticate(); // will deduplicate automatically now
        }
        return this._accessToken;
    }
    hasValidToken() {
        return this._accessToken !== undefined && !this.isAccessTokenExpired();
    }
    startAutoRefresh() {
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }
        this._refreshInterval = setInterval(async () => {
            var _a, _b;
            const bufferTime = this.loginBuffer * 1000; // minutes before expiration
            const now = new Date().getTime();
            const exp = (_b = (_a = this._refreshTokenExpiration) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0;
            if (exp - now < bufferTime) {
                await this.authenticate();
            }
        }, 30 * 1000); // check every 30 seconds
    }
    async authenticate() {
        if (this._authenticatingPromise) {
            // If already authenticating, reuse it
            return this._authenticatingPromise;
        }
        this._authenticatingPromise = (async () => {
            if (!this.isAccessTokenExpired() && !this.isRefreshTokenExpired())
                return true;
            const tokenResponse = await this.getTokenFromRefreshToken() || await this.getTokenFromCredentials();
            this.setTokens(tokenResponse);
            return !!tokenResponse;
        })();
        try {
            return await this._authenticatingPromise;
        }
        finally {
            this._authenticatingPromise = undefined; // clear once finished
        }
    }
    async getTokenFromRefreshToken() {
        // If refresh token is expired then don't even try...
        if (this.isRefreshTokenExpired())
            return undefined;
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', 'hubspace_android');
        params.append('refresh_token', this._refreshToken);
        try {
            const response = await this._httpClient.post('/protocol/openid-connect/token', params);
            return response.status === 200 ? response.data : undefined;
        }
        catch (_a) {
            return undefined;
        }
    }
    async getTokenFromCredentials() {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', 'hubspace_android');
        params.append('username', this._username);
        params.append('password', this._password);
        try {
            const response = await this._httpClient.post('/protocol/openid-connect/token', params);
            return response.status === 200 ? response.data : undefined;
        }
        catch (_a) {
            return undefined;
        }
    }
    /**
     * Sets tokens to new values
     * @param response Response with tokens
     */
    setTokens(response) {
        if (!response) {
            this.clearTokens();
            return;
        }
        this._accessToken = response.access_token;
        this._refreshToken = response.refresh_token;
        const currentDate = new Date();
        this._accessTokenExpiration = new Date(currentDate.getTime() + response.expires_in * 1000);
        this._refreshTokenExpiration = new Date(currentDate.getTime() + response.refresh_expires_in * 1000);
        this.startAutoRefresh();
    }
    /**
     * Clears stored tokens
     */
    clearTokens() {
        this._accessToken = undefined;
        this._refreshToken = undefined;
        this._accessTokenExpiration = undefined;
        this._refreshTokenExpiration = undefined;
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
            this._refreshInterval = undefined;
        }
    }
    /**
     * Checks whether the access token is expired
     * @returns True if access token is expired otherwise false
     */
    isAccessTokenExpired() {
        return !this._accessTokenExpiration || this._accessTokenExpiration < new Date();
    }
    /**
     * Checks whether the refresh token is expired
     * @returns True if refresh token is expired otherwise false
     */
    isRefreshTokenExpired() {
        return !this._refreshTokenExpiration || this._refreshTokenExpiration < new Date();
    }
}
exports.tokenService = new TokenService();
//# sourceMappingURL=token.service.js.map