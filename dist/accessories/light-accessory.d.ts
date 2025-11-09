import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
import { HubspaceAccessory } from './hubspace-accessory';
/**
 * Light accessory for Hubspace platform
 */
export declare class LightAccessory extends HubspaceAccessory {
    /**
     * Color information for lights that support RGB
     */
    private readonly _lightColor;
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory);
    private configurePower;
    private configureBrightness;
    private configureColorRgb;
    private getHue;
    private setHue;
    private getSaturation;
    private setSaturation;
    private getOn;
    private setOn;
    private getBrightness;
    private setBrightness;
    private setRgbColor;
    private resetColor;
    private isColorDefined;
}
//# sourceMappingURL=light-accessory.d.ts.map