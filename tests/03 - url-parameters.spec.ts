import { test, expect } from 'playwright-test-coverage';
import path from 'path';
import {
	URL_PARAMS,
	SELECTORS,
	TEXT_SELECTORS,
	DIALOGS_SELECTORS,
	ENTITIES
} from './constants';
import { goToPageWithParams, turnBooleanState } from './utils';

test('URL Parameter: ?kiosk', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.KIOSK);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('01-kiosk.png');

});

test('URL Parameter: ?hide_header', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_HEADER);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page).toHaveScreenshot('02-hide_header.png');

});

test('URL Parameter: ?hide_sidebar', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_SIDEBAR);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('03-hide_sidebar.png');

});

test('URL Parameter: ?hide_menubutton', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_MENU_BUTTON);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.MENU_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('04-hide_menubutton.png');

});

test('URL Parameter: ?hide_settings', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_SETTINGS);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.SETTINGS)).toBeHidden();
	await expect(page).toHaveScreenshot('05-hide_settings.png');

});

test('URL Parameter: ?hide_notifications', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_NOTIFICATIONS);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.NOTIFICATIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('06-hide_notifications.png');

});

test('URL Parameter: ?hide_account', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_ACCOUNT);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.ACCOUNT)).toBeHidden();
	await expect(page).toHaveScreenshot('07-hide_account.png');

});

test('URL Parameter: ?hide_add_to_home_assistant', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_ADD_TO_HOME_ASSISTANT);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.ADD_TO_HOME_ASSISTANT)).toBeHidden();
	await expect(page).toHaveScreenshot('08-hide_add_to_home_assistant.png');

});

test('URL Parameter: ?hide_search', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_SEARCH);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.SEARCH_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('09-hide_search.png');

});

test('URL Parameter: ?hide_assistant', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_ASSISTANT);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.ASSISTANT_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('10-hide_assistant.png');

});

test('URL Parameter: ?hide_overflow', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_OVERFLOW);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('11-hide_overflow.png');

});

test('URL Parameter: ?hide_refresh', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_REFRESH);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_REFRESH_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('12-hide_refresh.png');

});

test('URL Parameter: ?hide_unused_entities', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_UNUSED_ENTITIES);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_UNUSED_ENTITIES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('13-hide_unused_entities.png');

});

test('URL Parameter: ?hide_reload_resources', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_RELOAD_RESOURCES);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_RELOAD_RESOURCES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('14-hide_reload_resources.png');

});

test('URL Parameter: ?hide_edit_dashboard', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_EDIT_DASHBOARD);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('15-hide_edit_dashboard.png');

});

test('URL Parameter: ?block_overflow', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.BLOCK_OVERFLOW);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toHaveCSS('pointer-events', 'none');

});

test('URL Parameter: ?block_context_menu', async ({ context, page }) => {

	await context.addInitScript({
		path: path.join(__dirname, '..', './node_modules/sinon/pkg/sinon.js'),
	});

	await context.addInitScript(() => {
		window.__listener = window.sinon.fake();
		window.addEventListener('contextmenu', window.__listener);
	});

	await goToPageWithParams(page, URL_PARAMS.BLOCK_CONTEXT_MENU);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

	await page.locator(SELECTORS.HEADER).click({
		button: 'right'
	});

	const executed = await page.evaluate(() => window.__listener.calledOnce);

	expect(executed).toBe(false);

});

test('URL Parameter: ?disable_km', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.DISABLE_KM);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

	await turnBooleanState(page, ENTITIES.KIOSK, true);

	await expect(page.locator(SELECTORS.HEADER)).not.toBeHidden();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).not.toBeHidden();

	await turnBooleanState(page, ENTITIES.KIOSK, false);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

});

test('URL Parameter: ?hide_dialog_header_breadcrumb_navigation', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_HEADER_BREADCRUMB_NAVIGATION);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.BINARY_SENSOR).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.BREADCRUMB_NAVIGATION)).toBeHidden();
	await expect(page).toHaveScreenshot('16-hide_dialog_header_breadcrumb_navigation.png');

});

test('URL Parameter: ?hide_dialog_header_history', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_HEADER_HISTORY);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('17-hide_dialog_header_history.png');

});

test('URL Parameter: ?hide_dialog_header_settings', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_HEADER_SETTINGS);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('18-hide_dialog_header_settings.png');

});

test('URL Parameter: ?hide_dialog_header_overflow', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_HEADER_OVERFLOW);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('19-hide_dialog_header_overflow.png');

});

test('URL Parameter: ?hide_dialog_header_action_items', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_HEADER_ACTION_ITEMS);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('20-hide_dialog_header_action_items.png');

});

test('URL Parameter: ?hide_dialog_history', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_HISTORY);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.HOME).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.HISTORY)).toBeHidden();
	await expect(page).toHaveScreenshot('21-hide_dialog_history.png');

});

test('URL Parameter: ?hide_dialog_logbook', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_LOGBOOK);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.BINARY_SENSOR).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LOGBOOK)).toBeHidden();
	await expect(page).toHaveScreenshot('22-hide_dialog_logbook.png');

});

test('URL Parameter: ?hide_dialog_update_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_UPDATE_ACTIONS);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.UPDATE_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('23-hide_dialog_update_actions.png');

});

test('URL Parameter: ?hide_dialog_camera_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_CAMERA_ACTIONS);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.CAMERA).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CAMERA_ACTIONS)).toBeHidden();

});

test('URL Parameter: ?hide_dialog_media_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_MEDIA_ACTIONS);

	await page.locator(SELECTORS.MEDIA_PLAYER_ENTITY_ROW).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.MEDIA_ACTIONS_MAIN)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.MEDIA_ACTIONS_SECONDARY)).toBeHidden();
	await expect(page).toHaveScreenshot('24-hide_dialog_media_actions.png');

});

test('URL Parameter: ?hide_dialog_climate_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_CLIMATE_ACTIONS);

	await page.locator(SELECTORS.CLIMATE_ENTITY_ROW, TEXT_SELECTORS.CLIMATE).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeHidden();
	await expect(page).toHaveScreenshot('25-hide_dialog_climate_actions.png');

});

test('URL Parameter: ?hide_dialog_climate_temperature_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS);

	await page.locator(SELECTORS.CLIMATE_ENTITY_ROW, TEXT_SELECTORS.CLIMATE).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeVisible();
	await expect(page).toHaveScreenshot('26-hide_dialog_climate_temperature_actions.png');

});

test('URL Parameter: ?hide_dialog_climate_settings_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS);

	await page.locator(SELECTORS.CLIMATE_ENTITY_ROW, TEXT_SELECTORS.CLIMATE).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeHidden();
	await expect(page).toHaveScreenshot('27-hide_dialog_climate_settings_actions.png');

});

test('URL Parameter: ?hide_dialog_light_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_LIGHT_ACTIONS);

	await page.locator(SELECTORS.TOGGLE_ENTITY_ROW, TEXT_SELECTORS.LIGHT).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('28-hide_dialog_light_actions.png');

});

test('URL Parameter: ?hide_dialog_light_control_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS);

	await page.locator(SELECTORS.TOGGLE_ENTITY_ROW, TEXT_SELECTORS.LIGHT).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();

	await page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS).scrollIntoViewIfNeeded();

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();
	await expect(page).toHaveScreenshot('29-hide_dialog_light_control_actions.png');

});

test('URL Parameter: ?hide_dialog_light_color_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_LIGHT_COLOR_ACTIONS);

	await page.locator(SELECTORS.TOGGLE_ENTITY_ROW, TEXT_SELECTORS.LIGHT).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();

	await page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS).scrollIntoViewIfNeeded();

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();
	await expect(page).toHaveScreenshot('30-hide_dialog_light_color_actions.png');

});

test('URL Parameter: ?hide_dialog_light_settings_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS);

	await page.locator(SELECTORS.TOGGLE_ENTITY_ROW, TEXT_SELECTORS.LIGHT).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();

	await page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS).scrollIntoViewIfNeeded();

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('31-hide_dialog_light_settings_actions.png');

});

test('URL Parameter: ?hide_dialog_timer_actions', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_TIMER_ACTIONS);

	await page.locator(SELECTORS.TIMER_ENTITY_ROW, TEXT_SELECTORS.TIMER).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.TIMER_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('32-hide_dialog_timer_actions.png');

});

test('URL Parameter: ?hide_dialog_history_show_more', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_HISTORY_SHOW_MORE);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.HOME).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_LINK)).toBeHidden();
	await expect(page).toHaveScreenshot('33-hide_dialog_history_show_more.png');

});

test('URL Parameter: ?hide_dialog_logbook_show_more', async ({ page }) => {

	await goToPageWithParams(page, URL_PARAMS.HIDE_DIALOG_LOGBOOK_SHOW_MORE);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.BINARY_SENSOR).click();
	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LOGBOOK_LINK)).toBeHidden();
	await expect(page).toHaveScreenshot('34-hide_dialog_logbook_show_more.png');

});