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
          '--mdc-drawer-width': '0 !important'
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
    DIALOG_UPDATE_ACTIONS: getDisplayNoneRulesString(
        '.actions',
        `hr:has(+ .actions)`
    ),
    DIALOG_CLIMATE_ACTIONS: getDisplayNoneRulesString(
        ELEMENT.HA_DIALOG_CLIMATE
    ),
    DIALOG_SHOW_MORE: getDisplayNoneRulesString(
        `.header a`
    )
};