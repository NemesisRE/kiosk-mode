import { MENU, LOVELACE_MODE } from '@constants';
import {
    getCSSRulesString,
    getDisplayNoneRulesString
} from '@utilities';

const APP_TOOLBAR = 'app-toolbar';
const TOOLBAR = '.toolbar';
const ACTION_ITEMS = '.action-items';
const BUTTON_MENU = 'ha-button-menu';
const OVERFLOW_BUTTON_MENU = 'mwc-list-item';

const STYLES_COMMON = {
    HEADER: getCSSRulesString({
        '#view': {
          'min-height': '100vh !important',
          '--header-height': '0'
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
    })
};

const STYLES_LEGACY = {
    HEADER: getCSSRulesString({
        'app-header': {
            'display': 'none'
        }
    }),
    SIDEBAR: getCSSRulesString({
        ':host': {
            '--app-drawer-width': '0 !important'
        },
        '#drawer': {
            'display': 'none'
        },
    }),
    OVERFLOW_MENU: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU}`
    ),
    OVERFLOW_MENU_EMPTY_DESKTOP: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.STORAGE}][data-children="1"]`,
        `${APP_TOOLBAR} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.YAML}][data-children="4"]`
    ),
    OVERFLOW_MENU_EMPTY_MOBILE: getDisplayNoneRulesString(
        `${APP_TOOLBAR} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.STORAGE}][data-children="3"]`,
        `${APP_TOOLBAR} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.YAML}][data-children="6"]`
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
    )
};

const STYLES = {
    HEADER: getCSSRulesString({
        '.header': {
            'display': 'none'
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
    OVERFLOW_MENU: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU}`
    ),
    OVERFLOW_MENU_EMPTY_DESKTOP: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.STORAGE}][data-children="1"]`,
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.YAML}][data-children="4"]`
    ),
    OVERFLOW_MENU_EMPTY_MOBILE: getDisplayNoneRulesString(
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.STORAGE}][data-children="3"]`,
        `${TOOLBAR} > ${ACTION_ITEMS} > ${BUTTON_MENU}[data-lovelace-mode=${LOVELACE_MODE.YAML}][data-children="6"]`
    ),
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

export const getStyles = (isLegacy: boolean) => {

    // If it is legacy Home Assistant
    if (isLegacy) {
        return {
            HEADER: `${STYLES_COMMON.HEADER}${STYLES_LEGACY.HEADER}`,
            SIDEBAR: STYLES_LEGACY.SIDEBAR,
            ACCOUNT: STYLES_COMMON.ACCOUNT,
            MENU_BUTTON: STYLES_COMMON.MENU_BUTTON,
            MENU_BUTTON_BURGER: STYLES_COMMON.MENU_BUTTON_BURGER,
            OVERFLOW_MENU: STYLES_LEGACY.OVERFLOW_MENU,
            OVERFLOW_MENU_EMPTY_DESKTOP: STYLES_LEGACY.OVERFLOW_MENU_EMPTY_DESKTOP,
            OVERFLOW_MENU_EMPTY_MOBILE: STYLES_LEGACY.OVERFLOW_MENU_EMPTY_MOBILE,
            SEARCH: STYLES_LEGACY.SEARCH,
            ASSISTANT: STYLES_LEGACY.ASSISTANT,
            REFRESH: STYLES_LEGACY.REFRESH,
            UNUSED_ENTITIES: STYLES_LEGACY.UNUSED_ENTITIES,
            RELOAD_RESOURCES: STYLES_LEGACY.RELOAD_RESOURCES,
            EDIT_DASHBOARD: STYLES_LEGACY.EDIT_DASHBOARD,
            MOUSE: STYLES_COMMON.MOUSE
        };
    }

    // Home Assistant >= 2023.4.x
    return {
        HEADER: `${STYLES_COMMON.HEADER}${STYLES.HEADER}`,
        SIDEBAR: STYLES.SIDEBAR,
        ACCOUNT: STYLES_COMMON.ACCOUNT,
        MENU_BUTTON: STYLES_COMMON.MENU_BUTTON,
        MENU_BUTTON_BURGER: STYLES_COMMON.MENU_BUTTON_BURGER,
        OVERFLOW_MENU: STYLES.OVERFLOW_MENU,
        OVERFLOW_MENU_EMPTY_DESKTOP: STYLES.OVERFLOW_MENU_EMPTY_DESKTOP,
        OVERFLOW_MENU_EMPTY_MOBILE: STYLES.OVERFLOW_MENU_EMPTY_MOBILE,
        SEARCH: STYLES.SEARCH,
        ASSISTANT: STYLES.ASSISTANT,
        REFRESH: STYLES.REFRESH,
        UNUSED_ENTITIES: STYLES.UNUSED_ENTITIES,
        RELOAD_RESOURCES: STYLES.RELOAD_RESOURCES,
        EDIT_DASHBOARD: STYLES.EDIT_DASHBOARD,
        MOUSE: STYLES_COMMON.MOUSE
    };
};