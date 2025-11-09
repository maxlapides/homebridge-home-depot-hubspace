/**
 * Service for managing JWT tokens
 */
declare class TokenService {
    loginBuffer: number;
    private _refreshInterval?;
    private readonly _httpClient;
    private _accessToken?;
    private _accessTokenExpiration?;
    private _refreshToken?;
    private _refreshTokenExpiration?;
    private _username;
    private _password;
    private _authenticatingPromise?;
    /**
     * Creates a new instance of token service
     */
    constructor();
    /**
     * Initializes {@link TokenService}
     * @param username Account username
     * @param password Account password
     */
    login(username: string, password: string): void;
    getToken(): Promise<string | undefined>;
    hasValidToken(): boolean;
    private startAutoRefresh;
    private authenticate;
    private getTokenFromRefreshToken;
    private getTokenFromCredentials;
    /**
     * Sets tokens to new values
     * @param response Response with tokens
     */
    private setTokens;
    /**
     * Clears stored tokens
     */
    private clearTokens;
    /**
     * Checks whether the access token is expired
     * @returns True if access token is expired otherwise false
     */
    private isAccessTokenExpired;
    /**
     * Checks whether the refresh token is expired
     * @returns True if refresh token is expired otherwise false
     */
    private isRefreshTokenExpired;
}
export declare const tokenService: TokenService;
export {};
//# sourceMappingURL=token.service.d.ts.map