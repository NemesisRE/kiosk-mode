import { MENU } from '@constants';
import {
    getCSSRulesString,
    getDisplayNoneRulesString
} from '@utilities';

const TOOLBAR = '.toolbar';
const ACTION_ITEMS = '.action-items';
const BUTTON_MENU = 'ha-button-menu';
const OVERFLOW_BUTTON_MENU = 'mwc-list-item';

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
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU}`
    ),
    BLOCK_OVERFLOW: getCSSRulesString({
        [`${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU}`]: {
            'pointer-events': 'none !important'
        }
    }),
    SEARCH: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.SEARCH}"]`,
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.SEARCH}"]`
    ),
    ASSISTANT: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ha-icon-button[data-selector="${MENU.ASSIST}"]`,
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.ASSIST}"]`
    ),
    REFRESH: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.REFRESH}"]`
    ),
    UNUSED_ENTITIES: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.UNUSED_ENTITIES}"]`,
    ),
    RELOAD_RESOURCES: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.RELOAD_RESOURCES}"]`
    ),
    EDIT_DASHBOARD: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.EDIT_DASHBOARD}"]`
    )
};