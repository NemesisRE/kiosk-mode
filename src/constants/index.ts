export const NAMESPACE = 'kiosk-mode';
export const STYLES_PREFIX = 'kiosk_mode';
export const NON_CRITICAL_WARNING = '[ Non critial warning ]';
export const SHADOW_ROOT_SUFFIX = ':shadowRoot';

export enum CACHE {
    HEADER = 'kmHeader',
    SIDEBAR = 'kmSidebar',
    OVERFLOW = 'kmOverflow',
    MENU_BUTTON = 'kmMenuButton',
    ACCOUNT = 'kmAccount',
    SEARCH = 'kmSearch',
    ASSISTANT = 'kmAssistant',
    REFRESH = 'kmRefresh',
    UNUSED_ENTITIES = 'kmUnusedEntities',
    RELOAD_RESOURCES = 'kmReloadResources',
    EDIT_DASHBOARD = 'kmEditDashboard',
    OVERFLOW_MOUSE = 'kmOverflowMouse',
    MOUSE = 'kmMouse'
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
    HIDE_ASSISTANT = 'hide_assistant',
    HIDE_REFRESH = 'hide_refresh',
    HIDE_UNUSED_ENTITIES = 'hide_unused_entities',
    HIDE_RELOAD_RESOURCES = 'hide_reload_resources',
    HIDE_EDIT_DASHBOARD = 'hide_edit_dashboard',
    BLOCK_OVERFLOW = 'block_overflow',
    BLOCK_MOUSE = 'block_mouse'
}

const UI_PREFIX = 'ui';
const COMMON_PREFIX = `${UI_PREFIX}.common`;
const PANEL_PREFIX = `${UI_PREFIX}.panel`;
const LOVELACE_PREFIX = `${PANEL_PREFIX}.lovelace`;
const MENU_PREFIX = `${LOVELACE_PREFIX}.menu`;

export enum MENU {
    SEARCH = 'SEARCH',
    ASSIST = 'ASSIST',
    REFRESH = 'REFRESH',
    UNUSED_ENTITIES = 'UNUSED_ENTITIES',
    RELOAD_RESOURCES = 'RELOAD_RESOURCES',
    EDIT_DASHBOARD = 'EDIT_DASHBOARD'
}

export const MENU_REFERENCES = Object.freeze({
    [MENU.SEARCH]: `${MENU_PREFIX}.search`,
    [MENU.ASSIST]: `${MENU_PREFIX}.assist`,
    [MENU.REFRESH]: `${COMMON_PREFIX}.refresh`,
    [MENU.UNUSED_ENTITIES]: `${LOVELACE_PREFIX}.unused_entities.title`,
    [MENU.RELOAD_RESOURCES]: `${MENU_PREFIX}.reload_resources`,
    [MENU.EDIT_DASHBOARD]: `${MENU_PREFIX}.configure_ui`
});

export enum ELEMENT {
    HOME_ASSISTANT = 'home-assistant',
    HOME_ASSISTANT_MAIN = 'home-assistant-main',
    HA_PANEL_LOVELACE = 'ha-panel-lovelace',
    PARTIAL_PANEL_RESOLVER = 'partial-panel-resolver',
    HUI_ROOT = 'hui-root',
    HUI_VIEW = 'hui-view',
    MENU_ITEM = 'ha-icon-button',
    MENU_ITEM_ICON = 'mwc-icon-button',
    OVERLAY_MENU_ITEM = 'mwc-list-item',
    HA_SIDEBAR = 'ha-sidebar',
    HA_DRAWER = 'ha-drawer',
    TOOLBAR = '.toolbar',
    ACTION_ITEMS = '.action-items',
    HA_MORE_INFO_DIALOG = 'ha-more-info-dialog',
    HA_DIALOG = 'ha-dialog'
}

export const TRUE = 'true';
export const FALSE = 'false';
export const BOOLEAN = 'boolean';
export const CUSTOM_MOBILE_WIDTH_DEFAULT = 812;
export const SUSCRIBE_EVENTS_TYPE = 'subscribe_events';
export const STATE_CHANGED_EVENT = 'state_changed';
export const MAX_ATTEMPTS = 500;
export const RETRY_DELAY = 50;
export const WINDOW_RESIZE_DELAY = 250;