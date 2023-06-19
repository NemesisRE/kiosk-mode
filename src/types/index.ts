export interface KioskModeRunner {
    run: (lovelace: HTMLElement) => void;
    runDialogs: (moreInfoDialog: Element) => Promise<void>;
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

export interface KioskConfig {
    kiosk?: boolean;
    hide_header?: boolean;
    hide_sidebar?: boolean;
    hide_overflow?: boolean;
    hide_menubutton?: boolean;
    hide_account?: boolean;
    hide_search?: boolean;
    hide_assistant?: boolean;
    hide_refresh?: boolean;
    hide_unused_entities?: boolean;
    hide_reload_resources?: boolean;
    hide_edit_dashboard?: boolean;
    hide_dialog_header_history?: boolean;
    hide_dialog_header_settings?: boolean;
    hide_dialog_header_overflow?: boolean;
    hide_dialog_history?: boolean;
    hide_dialog_logbook?: boolean;
    hide_dialog_attributes?: boolean;
    hide_dialog_media_actions?: boolean;
    hide_dialog_update_actions?: boolean;
    hide_dialog_climate_actions?: boolean;
    hide_dialog_history_show_more?: boolean;
    hide_dialog_logbook_show_more?: boolean;
    block_overflow?: boolean;
    block_mouse?: boolean;
    admin_settings?: ConditionalKioskConfig;
    non_admin_settings?: ConditionalKioskConfig;
    user_settings?: UserSetting[];
    mobile_settings?: MobileSettings;
    entity_settings?: EntitySettings;
}

export interface ConditionalKioskConfig extends KioskConfig {
    ignore_entity_settings?: boolean;
    ignore_mobile_settings?: boolean;
    ignore_disable_km?: boolean;
}

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
    }
}

export class Lovelace extends HTMLElement {
    lovelace: {
        config: {
            kiosk_mode: KioskConfig;
        };
        mode: string;
    }
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

export type StyleElement = HTMLElement | ShadowRoot | HTMLElement[] | ShadowRoot[];

declare global {
    interface Window {
        kioskModeEntities: Record<string, string[]>;
        KioskMode: KioskModeRunner;
        hassConnection: Promise<HassConnection>;
    }
  }