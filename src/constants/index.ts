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
    DIALOG_HEADER_ACTION_ITEMS = 'kmDialogHeaderActionItems',
    DIALOG_HEADER_HISTORY = 'kmDialogHeaderHistory',
    DIALOG_HEADER_SETTINGS = 'kmDialogHeaderSettings',
    DIALOG_HEADER_OVERFLOW = 'kmDialogHeaderOverflow',
    DIALOG_HISTORY = 'kmDialogHistory',
    DIALOG_LOGBOOK = 'kmDialogLogbook',
    DIALOG_ATTRIBUTES = 'kmDialogAttributes',
    DIALOG_MEDIA_ACTIONS = 'kmDialogMediaActions',
    DIALOG_UPDATE_ACTIONS = 'kmDialogUpdateActions',
    DIALOG_CLIMATE_ACTIONS = 'kmDialogClimateActions',
    DIALOG_HISTORY_SHOW_MORE = 'kmDialogHistoryShowMore',
    DIALOG_LOGBOOK_SHOW_MORE = 'kmDialogLogbookShowMore',
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
    HIDE_DIALOG_HEADER_ACTION_ITEMS = 'hide_dialog_header_action_items',
    HIDE_DIALOG_HEADER_HISTORY = 'hide_dialog_header_history',
    HIDE_DIALOG_HEADER_SETTINGS = 'hide_dialog_header_settings',
    HIDE_DIALOG_HEADER_OVERFLOW = 'hide_dialog_header_overflow',
    HIDE_DIALOG_HISTORY = 'hide_dialog_history',
    HIDE_DIALOG_LOGBOOK = 'hide_dialog_logbook',
    HIDE_DIALOG_ATTRIBUTES = 'hide_dialog_attributes',
    HIDE_DIALOG_MEDIA_ACTIONS = 'hide_dialog_media_actions',
    HIDE_DIALOG_UPDATE_ACTIONS = 'hide_dialog_update_actions',
    HIDE_DIALOG_CLIMATE_ACTIONS = 'hide_dialog_climate_actions',
    HIDE_DIALOG_HISTORY_SHOW_MORE = 'hide_dialog_history_show_more',
    HIDE_DIALOG_LOGBOOK_SHOW_MORE = 'hide_dialog_logbook_show_more',
    BLOCK_OVERFLOW = 'block_overflow',
    BLOCK_MOUSE = 'block_mouse',
    // Conditional configuration
    IGNORE_ENTITY_SETTINGS = 'ignore_entity_settings',
    IGNORE_MOBILE_SETTINGS = 'ignore_mobile_settings',
    IGNORE_DISABLE_KM = 'ignore_disable_km'
}

const UI_PREFIX = 'ui';
const COMMON_PREFIX = `${UI_PREFIX}.common`;
const PANEL_PREFIX = `${UI_PREFIX}.panel`;
const LOVELACE_PREFIX = `${PANEL_PREFIX}.lovelace`;
const MENU_PREFIX = `${LOVELACE_PREFIX}.menu`;
const DIALOGS_PREFIX = `${UI_PREFIX}.dialogs.more_info_control`;

export enum MENU {
    SEARCH = 'SEARCH',
    ASSIST = 'ASSIST',
    REFRESH = 'REFRESH',
    UNUSED_ENTITIES = 'UNUSED_ENTITIES',
    RELOAD_RESOURCES = 'RELOAD_RESOURCES',
    EDIT_DASHBOARD = 'EDIT_DASHBOARD',
    DIALOG_DISMISS = 'DIALOG_DISMISS',
    DIALOG_HISTORY = 'DIALOG_HISTORY',
    DIALOG_SETTINGS = 'DIALOG_SETTINGS'
}

export const MENU_REFERENCES = Object.freeze({
    [MENU.SEARCH]: `${MENU_PREFIX}.search`,
    [MENU.ASSIST]: `${MENU_PREFIX}.assist`,
    [MENU.REFRESH]: `${COMMON_PREFIX}.refresh`,
    [MENU.UNUSED_ENTITIES]: `${LOVELACE_PREFIX}.unused_entities.title`,
    [MENU.RELOAD_RESOURCES]: `${MENU_PREFIX}.reload_resources`,
    [MENU.EDIT_DASHBOARD]: `${MENU_PREFIX}.configure_ui`,
    [MENU.DIALOG_HISTORY]: `${DIALOGS_PREFIX}.history`,
    [MENU.DIALOG_SETTINGS]: `${DIALOGS_PREFIX}.settings`,
    [MENU.DIALOG_DISMISS]: `${DIALOGS_PREFIX}.dismiss`

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
    BUTTON_MENU = 'ha-button-menu',
    OVERLAY_MENU_ITEM = 'mwc-list-item',
    HA_SIDEBAR = 'ha-sidebar',
    HA_DRAWER = 'ha-drawer',
    TOOLBAR = '.toolbar',
    ACTION_ITEMS = '.action-items',
    HA_MORE_INFO_DIALOG = 'ha-more-info-dialog',
    HA_DIALOG = 'ha-dialog',
    HA_DIALOG_HEADER = 'ha-dialog-header',
    HA_DIALOG_CONTENT = '.content',
    HA_DIALOG_MORE_INFO = 'ha-more-info-info',
    HA_DIALOG_HISTORY = 'ha-more-info-history',
    HA_DIALOG_LOGBOOK = 'ha-more-info-logbook',
    HA_DIALOG_MORE_INFO_CONTENT = 'more-info-content',
    HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK = 'ha-more-info-history-and-logbook',
    HA_DIALOG_DEFAULT = 'more-info-default',
    HA_DIALOG_MEDIA_PLAYER = 'more-info-media_player',
    HA_DIALOG_UPDATE = 'more-info-update',
    HA_DIALOG_CLIMATE = 'more-info-climate',
    HA_DIALOG_ATTRIBUTES = 'ha-attributes'
}

export const TRUE = 'true';
export const FALSE = 'false';
export const CUSTOM_MOBILE_WIDTH_DEFAULT = 812;
export const SUSCRIBE_EVENTS_TYPE = 'subscribe_events';
export const STATE_CHANGED_EVENT = 'state_changed';
export const MAX_ATTEMPTS = 500;
export const RETRY_DELAY = 50;
export const WINDOW_RESIZE_DELAY = 250;