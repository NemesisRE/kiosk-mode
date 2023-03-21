export const STYLES_PREFIX = 'kiosk_mode';

export enum CACHE {
    HEADER = 'kmHeader',
    SIDEBAR = 'kmSidebar',
    OVERFLOW = 'kmOverflow',
    MENU_BUTTON = 'kmMenuButton',
    ACCOUNT = 'kmAccount',
    SEARCH = 'kmSearch',
    ASSISTANT = 'kmAssistant'
}

export enum OPTION {
    KIOSK = 'kiosk',
    CACHE = 'cache',
    CLEAR_CACHE = 'clear_km_cache',
    DISABLE_KIOSK_MODE = 'disable_km',
    HIDE_SIDEBAR = 'hide_sidebar',
    HIDE_HEADER = 'hide_header',
    HIDE_OVERFLOW = 'hide_overflow',
    HIDE_MENU_BUTTON = 'hide_menubutton',
    HIDE_ACCOUNT = 'hide_account',
    HIDE_SEARCH = 'hide_search',
    HIDE_ASSISTANT = 'hide_assistant'
}

export enum ELEMENT {
    HOME_ASSISTANT = 'home-assistant',
    HOME_ASSISTANT_MAIN = 'home-assistant-main',
    HA_PANEL_LOVELACE = 'ha-panel-lovelace',
    PARTIAL_PANEL_RESOLVER = 'partial-panel-resolver',
    HUI_ROOT = 'hui-root',
    HUI_VIEW = 'hui-view',
    APP_DRAWER_LAYOUT = 'app-drawer-layout',
    APP_TOOLBAR = 'app-toolbar',
    APP_DRAWER = 'app-drawer',
    HA_SIDEBAR = 'ha-sidebar'
}