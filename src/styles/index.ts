import { MENU, LOVELACE_MODE } from '@constants';
import {
    getCSSRulesString,
    getDisplayNoneRulesString
} from '@utilities';

const APP_TOOLBAR = 'app-toolbar';
const BUTTON_MENU = 'ha-button-menu';
const OVERFLOW_BUTTON_MENU = 'mwc-list-item';

export const STYLES = {
    HEADER: getCSSRulesString({
        '#view': {
          'min-height': '100vh !important',
          '--header-height': '0'
        },
        'app-header': {
          'display': 'none'
        }
    }),
    SIDEBAR: getCSSRulesString({
        ':host': {
          '--app-drawer-width': '0 !important',
        },
        '#drawer': {
          'display': 'none'
        }
    }),
    ACCOUNT: getDisplayNoneRulesString('.profile'),
    MENU_BUTTON: getDisplayNoneRulesString('.menu ha-icon-button'),
    MENU_BUTTON_BURGER: getDisplayNoneRulesString('ha-menu-button'),
    OVERFLOW_MENU: getDisplayNoneRulesString(`${APP_TOOLBAR} > ${BUTTON_MENU}`),
    OVERFLOW_MENU_EMPTY: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.STORAGE}][data-children="1"]`,
        `${APP_TOOLBAR} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.YAML}][data-children="4"]`
    ),
    SEARCH: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ha-icon-button[data-selector="${MENU.SEARCH}"]`,
        `${APP_TOOLBAR} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.SEARCH}"]`
    ),
    ASSISTANT: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ha-icon-button[data-selector="${MENU.ASSIST}"]`,
        `${APP_TOOLBAR} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.ASSIST}"]`
    ),
    REFRESH: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.REFRESH}"]`
    ),
    UNUSED_ENTITIES: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.UNUSED_ENTITIES}"]`
    ),
    RELOAD_RESOURCES: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.RELOAD_RESOURCES}"]`
    ),
    EDIT_DASHBOARD: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU} > ${OVERFLOW_BUTTON_MENU}[data-selector="${MENU.EDIT_DASHBOARD}"]`
    ),
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
    })
};