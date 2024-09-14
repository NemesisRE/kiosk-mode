import { HomeAssistant, Hass } from 'home-assistant-javascript-templates';
import { OPTION, CONDITIONAL_OPTION } from '@constants';

export interface KioskModeRunner {
    run: (lovelace: HTMLElement) => Promise<void>;
    runDialogs: (dialog: Element) => void;
}

export interface MobileSettings extends Exclude<ConditionalKioskConfig, 'ignore_mobile_settings'> {
    custom_width: number;
}

export interface UserSetting extends ConditionalKioskConfig {
    users: string[];
}

type BaseKioskConfig = Partial<
    Record<
        OPTION,
        boolean | string
    >
>;

type BaseConditionalKioskConfig = Partial<
    Record<
        CONDITIONAL_OPTION,
        boolean | string
    >
>;

export type Options = Partial<
    Record<
        OPTION | CONDITIONAL_OPTION,
        boolean
    >
>;

export interface KioskConfig extends BaseKioskConfig {
    admin_settings?: ConditionalKioskConfig;
    non_admin_settings?: ConditionalKioskConfig;
    user_settings?: UserSetting[];
    mobile_settings?: MobileSettings;
}

export type ConditionalKioskConfig = KioskConfig & BaseConditionalKioskConfig;

export interface HomeAsssistantExtended extends HomeAssistant {
    hass: Hass & {
        config: {
            version: string;
        };
        language: string;
        resources: Record<string, Record<string, string>>;
        panelUrl: string;
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

export interface SubscriberTemplate {
    result: string;
}

export type StyleElement = Element | ShadowRoot | Element[] | ShadowRoot[];

export interface MoreInfoDialog extends HTMLElement {
    __open: boolean;
}

declare global {
    interface Window {
        KioskMode: KioskModeRunner;
    }
}

export type Version = [number, number, string];