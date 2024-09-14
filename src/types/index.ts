import { HomeAssistant, Hass } from 'home-assistant-javascript-templates';
import {
	OPTION,
	CONDITIONAL_OPTION,
	DEBUG_CONFIG_OPTION
} from '@constants';

export interface KioskModeRunner {
    run: (lovelace: HTMLElement) => Promise<void>;
    runDialogs: (dialog: Element) => void;
}

export interface MobileSettings extends Exclude<ConditionalConfig, 'ignore_mobile_settings'> {
    custom_width: number;
}

export interface UserSetting extends ConditionalConfig {
    users: string[];
}

type BaseKioskConfig = Partial<
    Record<
        OPTION,
        boolean | string
    >
>;

type DebugKioskConfig = Partial<
    Record<
        DEBUG_CONFIG_OPTION,
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
        OPTION | CONDITIONAL_OPTION | DEBUG_CONFIG_OPTION,
        boolean
    >
>;

export interface KioskConfig extends BaseKioskConfig, BaseConditionalKioskConfig, DebugKioskConfig {
    admin_settings?: ConditionalConfig;
    non_admin_settings?: ConditionalConfig;
    user_settings?: UserSetting[];
    mobile_settings?: MobileSettings;
}

export type ConditionalConfig = BaseKioskConfig & BaseConditionalKioskConfig;

export interface HomeAsssistantExtended extends HomeAssistant {
    hass: Hass & {
        config: {
            version: string;
        };
        localize: (path: string) => string;
        panelUrl: string;
    };
}

export class ButtonItemTooltip extends HTMLElement {
	content: string;
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

export interface MoreInfoDialog extends HTMLElement {
    __open: boolean;
}

declare global {
    interface Window {
        KioskMode: KioskModeRunner;
    }
}

export type Version = [number, number, string];