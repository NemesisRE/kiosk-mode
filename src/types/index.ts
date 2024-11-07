import { OPTION, CONDITIONAL_OPTION } from '@constants';

export interface KioskModeRunner {
    run: (lovelace: HTMLElement) => Promise<void>;
    runDialogs: (dialog: Element) => void;
}

export interface User {
    name: string;
    is_admin: boolean;
}

export interface MobileSettings extends Exclude<ConditionalKioskConfig, 'ignore_mobile_settings'> {
    hide_header: boolean;
    custom_width: number;
}

export interface UserSetting extends ConditionalKioskConfig {
    users: string[];
}

export interface EntitySetting extends KioskConfig {
    entity: Record<string, string>;
}

export type EntitySettings = EntitySetting[];

type BaseKioskConfig = Partial<
    Record<
        OPTION,
        boolean
    >
>;

type BaseConditionalKioskConfig = Partial<
    Record<
        CONDITIONAL_OPTION,
        boolean
    >
>;

export interface KioskConfig extends BaseKioskConfig {
    admin_settings?: ConditionalKioskConfig;
    non_admin_settings?: ConditionalKioskConfig;
    user_settings?: UserSetting[];
    mobile_settings?: MobileSettings;
    entity_settings?: EntitySettings;
}

export type ConditionalKioskConfig = KioskConfig & BaseConditionalKioskConfig;

export interface EntityState {
    state: string;
}

export class HomeAssistant extends HTMLElement {
	hass: {
        user: User;
        config: {
            version: string;
        };
        language: string;
        resources: Record<string, Record<string, string>>;
        panelUrl: string;
        states: Record<string, EntityState>;
    };
}

export class Lovelace extends HTMLElement {
	lovelace: {
        config: {
            kiosk_mode: KioskConfig;
        };
        mode: string;
    };
}

export class HaSidebar extends HTMLElement {
	type: 'modal' | '';
	appContent: HTMLElement;
}

export type SuscriberEvent = {
    event_type: string;
    data: {
        entity_id: string;
        old_state?: {
            state: string;
        };
        new_state: {
            state: string;
        };
    }
};
export type SuscriberCallback = (event: SuscriberEvent) => void;
export type SuscriberOptions = {
    type: string;
    event_type: string;
};

export interface HassConnection {
    conn: {
        subscribeMessage: (callback: SuscriberCallback, options: SuscriberOptions) => void;
    }
}

declare global {
    interface Window {
        kioskModeEntities: Record<string, string[]>;
        KioskMode: KioskModeRunner;
        hassConnection: Promise<HassConnection>;
    }
}

export type Version = [number, number, string];