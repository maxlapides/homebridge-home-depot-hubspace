import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
import { HubspaceAccessory } from './hubspace-accessory';
export declare class SwitchAccessory extends HubspaceAccessory {
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory);
    private configurePower;
    private getOn;
    private setOn;
}
//# sourceMappingURL=switch-accessory.d.ts.map