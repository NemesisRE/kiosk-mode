import { MENU, ELEMENT } from '@constants';
import {
	getCSSRulesString,
	getDisplayNoneRulesString
} from '@utilities';

export const STYLES = {
	HEADER: getCSSRulesString({
		'#view': {
			'min-height': '100vh !important',
			'--header-height': '0px'
		},
		'.header': {
			'display': 'none'
		}
	}),
	ACCOUNT: getDisplayNoneRulesString('.profile'),
	NOTIFICATIONS: getDisplayNoneRulesString('.notifications-container'),
	DIVIDER: getDisplayNoneRulesString('.divider'),
	PAPER_LISTBOX: (hideAccount: boolean, hideNotifications: boolean) => {
		let size = 132;
		if (hideAccount && hideNotifications) {
			size = 0;
		} else if (hideAccount) {
			size -= 50;
		} else if (hideNotifications) {
			size -= 48;
		}
		return getCSSRulesString({
			'paper-listbox': {
				height: `calc(100% - var(--header-height) - ${size}px - env(safe-area-inset-bottom)) !important`
			}
		});
	},
	MENU_BUTTON: getDisplayNoneRulesString('.menu ha-icon-button'),
	MENU_BUTTON_BURGER: getDisplayNoneRulesString('ha-menu-button'),
	MOUSE: getCSSRulesString({
		'body::after': {
			'bottom': '0',
			'content': '""',
			'cursor': 'none',
			'display': 'block',
			'left': '0',
			'position': 'fixed',
			'right': '0',
			'top': '0',
			'z-index': '999999'
		}
	}),
	SIDEBAR: getCSSRulesString({
		':host': {
			'--mdc-drawer-width': '0px !important'
		},
		'partial-panel-resolver': {
			'--mdc-top-app-bar-width': '100% !important'
		},
		'ha-drawer > ha-sidebar': {
			'display': 'none'
		},
		'.header': {
			'width': '100% !important'
		}
	}),
	ASIDE: getDisplayNoneRulesString('.mdc-drawer'),
	OVERFLOW_MENU: getDisplayNoneRulesString(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU}`
	),
	BLOCK_OVERFLOW: getCSSRulesString({
		[`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU}`]: {
			'pointer-events': 'none !important'
		}
	}),
	SEARCH: getDisplayNoneRulesString(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.SEARCH}"]`,
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.SEARCH}"]`
	),
	ASSISTANT: getDisplayNoneRulesString(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.ASSIST}"]`,
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.ASSIST}"]`
	),
	REFRESH: getDisplayNoneRulesString(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.REFRESH}"]`
	),
	UNUSED_ENTITIES: getDisplayNoneRulesString(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.UNUSED_ENTITIES}"]`,
	),
	RELOAD_RESOURCES: getDisplayNoneRulesString(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.RELOAD_RESOURCES}"]`
	),
	EDIT_DASHBOARD: getDisplayNoneRulesString(
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.EDIT_DASHBOARD}"]`,
		`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.BUTTON_MENU} > ${ELEMENT.OVERLAY_MENU_ITEM}[data-selector="${MENU.EDIT_DASHBOARD}"]`
	),
	DIALOG_HEADER_HISTORY: getDisplayNoneRulesString(
		`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.MENU_ITEM}[data-selector="${MENU.DIALOG_HISTORY}"]`
	),
	DIALOG_HEADER_SETTINGS: getDisplayNoneRulesString(
		`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.MENU_ITEM}[data-selector="${MENU.DIALOG_SETTINGS}"]`
	),
	DIALOG_HEADER_OVERFLOW: getDisplayNoneRulesString(
		`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.BUTTON_MENU}`
	),
	DIALOG_HISTORY: getDisplayNoneRulesString(
		ELEMENT.HA_DIALOG_HISTORY
	),
	DIALOG_LOGBOOK: getDisplayNoneRulesString(
		ELEMENT.HA_DIALOG_LOGBOOK
	),
	DIALOG_ATTRIBUTES: getDisplayNoneRulesString(
		ELEMENT.HA_DIALOG_ATTRIBUTES
	),
	DIALOG_MEDIA_ACTIONS: getDisplayNoneRulesString(
		'.controls'
	),
	DIALOG_TIMER_ACTIONS: getDisplayNoneRulesString(
		'.actions'
	),
	DIALOG_UPDATE_ACTIONS: getDisplayNoneRulesString(
		'.actions',
		`hr:has(+ .actions)`
	),
	DIALOG_CLIMATE_CONTROL_SELECT: getDisplayNoneRulesString(
		ELEMENT.HA_DIALOG_CLIMATE_CONTROL_SELECT
	),
	DIALOG_CLIMATE_TEMPERATURE_BUTTONS: getDisplayNoneRulesString(
		ELEMENT.HA_DIALOG_CLIMATE_TEMPERATURE_BUTTONS
	),
	DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION: getDisplayNoneRulesString(
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION,
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION_SLIDER,
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION_TARGET_BORDER,
		ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION_TARGET
	),
	DIALOG_LIGHT_CONTROL_ACTIONS: getDisplayNoneRulesString(
		`.controls > ${ELEMENT.HA_DIALOG_LIGHT_BRIGHTNESS} + ${ELEMENT.HA_DIALOG_LIGHT_CONTROLS}`
	),
	DIALOG_LIGHT_COLOR_ACTIONS: getDisplayNoneRulesString(
		`.controls > ${ELEMENT.HA_DIALOG_LIGHT_COLORS}`
	),
	DIALOG_LIGHT_SETTINGS_ACTIONS: getDisplayNoneRulesString(
		`.controls:has(> ${ELEMENT.HA_DIALOG_LIGHT_BRIGHTNESS}) + div > ${ELEMENT.HA_DIALOG_LIGHT_SETTINGS}`
	),
	DIALOG_SHOW_MORE: getDisplayNoneRulesString(
		`.header a`
	)
};