export const BASE_URL = 'http://host.docker.internal:8123';
export const REQUEST_MAXIMUM_RETRIES = 10;

export const SELECTORS = {
	HUI_MASONRY_VIEW: 'hui-masonry-view',
	HA_SIDEBAR: 'ha-sidebar',
	HEADER: '.header',
	MENU_BUTTON: '.menu > ha-icon-button',
	NOTIFICATIONS: '.notifications-container',
	ACCOUNT: 'a.profile',
	SEARCH_BUTTON: 'ha-icon-button[data-selector="SEARCH"]',
	ASSISTANT_BUTTON: 'ha-icon-button[data-selector="ASSIST"]',
	OVERFLOW_BUTTON: 'ha-button-menu[slot="actionItems"]',
	MENU_REFRESH_ITEM: 'mwc-list-item[data-selector="REFRESH"]',
	MENU_UNUSED_ENTITIES_ITEM: 'mwc-list-item[data-selector="UNUSED_ENTITIES"]',
	MENU_RELOAD_RESOURCES_ITEM: 'mwc-list-item[data-selector="RELOAD_RESOURCES"]',
	MENU_EDIT_DASHBOARD_ITEM: 'mwc-list-item[data-selector="EDIT_DASHBOARD"]',
	ENTITY_ROW: 'hui-simple-entity-row'
};

export const DIALOGS_SELECTORS = {
	HISTORY_BUTTON: 'ha-icon-button[data-selector="DIALOG_HISTORY"]',
	SETTINGS_BUTTON: 'ha-icon-button[data-selector="DIALOG_SETTINGS"]',
	OVERFLOW_BUTTON: 'ha-icon-button[data-selector="DIALOG_SETTINGS"] + ha-button-menu',
	CLOSE_BUTTON: 'ha-icon-button[data-selector="DIALOG_DISMISS"]',
	HISTORY: '.content > ha-more-info-history',
	HISTORY_LINK: '.header > .title + a',
	ATTRIBUTES: 'slot[name="header"] > .header'
};

export const ENTITIES = {
	KIOSK: 'kiosk',
	HIDE_HEADER: 'kiosk_hide_header',
	HIDE_SIDEBAR: 'kiosk_hide_sidebar',
	HIDE_MENU_BUTTON: 'kiosk_hide_menubutton',
	HIDE_NOTIFICATIONS: 'kiosk_hide_notifications',
	HIDE_ACCOUNT: 'kiosk_hide_account',
	HIDE_SEARCH: 'kiosk_hide_search',
	HIDE_ASSISTANT: 'kiosk_hide_assistant',
	HIDE_OVERFLOW: 'kiosk_hide_overflow',
	HIDE_REFRESH: 'kiosk_hide_refresh',
	HIDE_UNUSED_ENTITIES: 'kiosk_hide_unused_entities',
	HIDE_RELOAD_RESOURCES: 'kiosk_hide_reload_resources',
	HIDE_EDIT_DASHBOARD: 'kiosk_hide_edit_dashboard',
	BLOCK_OVERFLOW: 'kiosk_block_overflow',
	BLOCK_CONTEXT_MENU: 'kiosk_block_context_menu',
	HIDE_DIALOG_HISTORY_BUTTON: 'kiosk_hide_dialog_header_history',
	HIDE_DIALOG_SETTINGS_BUTTON: 'kiosk_hide_dialog_header_settings',
	HIDE_DIALOG_OVERFLOW_BUTTON: 'kiosk_hide_dialog_header_overflow',
	HIDE_DIALOG_ACTION_ITEMS: 'kiosk_hide_dialog_header_action_items',
	HIDE_DIALOG_HISTORY: 'kiosk_hide_dialog_history',
	HIDE_DIALOG_ATTRIBUTES: 'kiosk_hide_dialog_attributes',
	HIDE_DIALOG_HISTORY_SHOW_MORE: 'kiosk_hide_dialog_history_show_more'
};

export const URL_PARAMS = {
	KIOSK: 'kiosk',
	HIDE_HEADER: 'hide_header',
	HIDE_SIDEBAR: 'hide_sidebar',
	HIDE_MENU_BUTTON: 'hide_menubutton',
	HIDE_NOTIFICATIONS: 'hide_notifications',
	HIDE_ACCOUNT: 'hide_account',
	HIDE_SEARCH: 'hide_search',
	HIDE_ASSISTANT: 'hide_assistant',
	HIDE_OVERFLOW: 'hide_overflow',
	HIDE_REFRESH: 'hide_refresh',
	HIDE_UNUSED_ENTITIES: 'hide_unused_entities',
	HIDE_RELOAD_RESOURCES: 'hide_reload_resources',
	HIDE_EDIT_DASHBOARD: 'hide_edit_dashboard',
	BLOCK_OVERFLOW: 'block_overflow',
	DISABLE_KM: 'disable_km',
	CACHE: 'cache',
	CLEAR_KM_CACHE: 'clear_km_cache'
};