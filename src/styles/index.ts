import { MENU, ELEMENT } from '@constants';
import { getDisplayNoneRules } from '@utilities';

export const STYLES = {
	HEADER: {
		'#view': {
			minHeight: '100vh !important',
			KioskHeaderHeight: '0px',
			paddingTop: 'calc(var(--kiosk-header-height) + env(safe-area-inset-top)) !important'
		},
		'.header': false
	},
	ACCOUNT: getDisplayNoneRules('.profile'),
	NOTIFICATIONS: getDisplayNoneRules('.notifications-container'),
	DIVIDER: getDisplayNoneRules('.divider'),
	PAPER_LISTBOX: (
		hideMenuButton: boolean,
		hideNotifications: boolean,
		hideAccount: boolean
	) => {
		const menuButtonHeight = 56;
		const notificationsHeight = 48;
		const accountHeight = 50;
		let sizeMinimized = 132;
		let sizeExpanded = 132;
		if (hideAccount && hideNotifications) {
			sizeMinimized = 0;
			sizeExpanded = 0;
		} else if (hideAccount) {
			sizeMinimized -= accountHeight;
			sizeExpanded -= accountHeight;
		} else if (hideNotifications) {
			sizeMinimized -= notificationsHeight;
			sizeExpanded -= notificationsHeight;
		}
		if (hideMenuButton) {
			sizeMinimized -= menuButtonHeight;
		}
		return {
			':host(:not([expanded])) paper-listbox': {
				height: `calc(100% - var(--header-height) - ${sizeMinimized}px - env(safe-area-inset-bottom)) !important`
			},
			':host([expanded]) paper-listbox': {
				height: `calc(100% - var(--header-height) - ${sizeExpanded}px - env(safe-area-inset-bottom)) !important`
			}
		};
	},
	MENU_BUTTON: getDisplayNoneRules(
		':host(:not([expanded])) .menu',
		':host([expanded]) .menu ha-icon-button'
	),
	MENU_BUTTON_BURGER: getDisplayNoneRules('ha-menu-button'),
	MOUSE: {
		'body::after': {
			bottom: 0,
			content: '""',
			cursor: 'none',
			display: 'block',
			left: 0,
			position: 'fixed',
			right: 0,
			top: 0,
			zIndex: 999999
		}
	},
	SIDEBAR: {
		':host': {
			MdcDrawerWidth: '0px !important'
		},
		'partial-panel-resolver': {
			MdcTopAppBarWidth: '100% !important'
		},
		'ha-drawer > ha-sidebar': false,
		'.header': {
			width: '100% !important'
		}
	},
	ASIDE: getDisplayNoneRules('.mdc-drawer'),
	OVERFLOW_MENU: getDisplayNoneRules(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU}`
	),
	BLOCK_OVERFLOW: {
		[`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU}`]: {
			'pointer-events': 'none !important'
		}
	},
	SEARCH: getDisplayNoneRules(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.SEARCH}"]`,
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.SEARCH}"]`
	),
	ASSISTANT: getDisplayNoneRules(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.ASSIST}"]`,
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.ASSIST}"]`
	),
	REFRESH: getDisplayNoneRules(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.REFRESH}"]`
	),
	UNUSED_ENTITIES: getDisplayNoneRules(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.UNUSED_ENTITIES}"]`,
	),
	RELOAD_RESOURCES: getDisplayNoneRules(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.RELOAD_RESOURCES}"]`
	),
	EDIT_DASHBOARD: getDisplayNoneRules(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.EDIT_DASHBOARD}"]`,
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.EDIT_DASHBOARD}"]`
	),
	DIALOG_HEADER_HISTORY: getDisplayNoneRules(
		`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.MENU_ITEM}[data-selector="${MENU.DIALOG_HISTORY}"]`
	),
	DIALOG_HEADER_SETTINGS: getDisplayNoneRules(
		`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.MENU_ITEM}[data-selector="${MENU.DIALOG_SETTINGS}"]`
	),
	DIALOG_HEADER_OVERFLOW: getDisplayNoneRules(
		`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.BUTTON_MENU}`
	),
	DIALOG_HISTORY: getDisplayNoneRules(
		ELEMENT.HA_DIALOG_HISTORY
	),
	DIALOG_LOGBOOK: getDisplayNoneRules(
		ELEMENT.HA_DIALOG_LOGBOOK
	),
	DIALOG_ATTRIBUTES: getDisplayNoneRules(
		ELEMENT.HA_DIALOG_ATTRIBUTES
	),
	DIALOG_MEDIA_ACTIONS: getDisplayNoneRules('.controls'),
	DIALOG_TIMER_ACTIONS: getDisplayNoneRules('.actions'),
	DIALOG_UPDATE_ACTIONS: getDisplayNoneRules(
		'.actions',
		`hr:has(+ .actions)`
	),
	DIALOG_CAMERA_ACTIONS: getDisplayNoneRules('.actions'),
	DIALOG_CLIMATE_CONTROL_SELECT: getDisplayNoneRules(
		ELEMENT.HA_DIALOG_CLIMATE_CONTROL_SELECT
	),
	DIALOG_CLIMATE_TEMPERATURE_BUTTONS: getDisplayNoneRules(
		ELEMENT.HA_DIALOG_CLIMATE_TEMPERATURE_BUTTONS
	),
	DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION: getDisplayNoneRules(
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION,
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION_SLIDER,
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION_TARGET_BORDER,
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION_TARGET
	),
	DIALOG_LIGHT_CONTROL_ACTIONS: getDisplayNoneRules(
		`.controls > ${ELEMENT.HA_DIALOG_LIGHT_BRIGHTNESS} + ${ELEMENT.HA_DIALOG_LIGHT_CONTROLS}`
	),
	DIALOG_LIGHT_COLOR_ACTIONS: getDisplayNoneRules(
		`.controls > ${ELEMENT.HA_DIALOG_LIGHT_COLORS}`
	),
	DIALOG_LIGHT_SETTINGS_ACTIONS: getDisplayNoneRules(
		`.controls:has(> ${ELEMENT.HA_DIALOG_LIGHT_BRIGHTNESS}) + div > ${ELEMENT.HA_DIALOG_LIGHT_SETTINGS}`
	),
	DIALOG_SHOW_MORE: getDisplayNoneRules('.header a')
};