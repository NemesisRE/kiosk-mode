import { test, expect } from 'playwright-test-coverage';
import {
	SELECTORS,
	DIALOGS_SELECTORS,
	TEXT_SELECTORS,
	ENTITIES
} from './constants';
import { turnBooleanState, goToPage } from './utils';

test('Option: hide_dialog_header_history', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_BUTTON, true);

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('01-hide_dialog_header_history.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_BUTTON, false);

});

test('Option: hide_dialog_header_settings', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();

	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_SETTINGS_BUTTON, true);

	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('02-hide_dialog_header_settings.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_SETTINGS_BUTTON, false);

});

test('Option: hide_dialog_header_overflow', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();
	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_OVERFLOW_BUTTON, true);

	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('03-hide_dialog_header_overflow.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_OVERFLOW_BUTTON, false);

});

test('Option: hide_dialog_header_action_items', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_ACTION_ITEMS, true);

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('04-hide_dialog_header_action_items.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_ACTION_ITEMS, false);

});

test('Option: hide_dialog_history', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.HOME).click();

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY, true);

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY)).toBeHidden();
	await expect(page).toHaveScreenshot('05-hide_dialog_history.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY, false);

});

test('Option: hide_dialog_logbook', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.BINARY_SENSOR).click();

	await expect(page.locator(DIALOGS_SELECTORS.LOGBOOK)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LOGBOOK, true);

	await expect(page.locator(DIALOGS_SELECTORS.LOGBOOK)).toBeHidden();
	await expect(page).toHaveScreenshot('06-hide_dialog_logbook.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LOGBOOK, false);

});

test('Option: hide_dialog_attributes', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.HOME).click();

	await expect(page.locator(DIALOGS_SELECTORS.ATTRIBUTES, TEXT_SELECTORS.ATTRIBUTES)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_ATTRIBUTES, true);

	await expect(page.locator(DIALOGS_SELECTORS.ATTRIBUTES, TEXT_SELECTORS.ATTRIBUTES)).toBeHidden();
	await expect(page).toHaveScreenshot('07-hide_dialog_attributes.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_ATTRIBUTES, false);

});

test('Option: hide_dialog_update_actions', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.UPDATE_ENTITY_ROW, TEXT_SELECTORS.ADDON).click();

	await expect(page.locator(DIALOGS_SELECTORS.ACTIONS, TEXT_SELECTORS.UPDATE_ACTION)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_UPDATE_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.ACTIONS, TEXT_SELECTORS.UPDATE_ACTION)).toBeHidden();
	await expect(page).toHaveScreenshot('08-hide_dialog_update_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_UPDATE_ACTIONS, false);

});

test('Option: hide_dialog_camera_actions', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.CAMERA).click();

	await expect(page.locator(DIALOGS_SELECTORS.ACTIONS, TEXT_SELECTORS.CAMERA_ACTION)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CAMERA_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.ACTIONS, TEXT_SELECTORS.CAMERA_ACTION)).toBeHidden();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CAMERA_ACTIONS, false);

});

test('Option: hide_dialog_media_actions', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.MEDIA_PLAYER_ENTITY_ROW).click();

	await expect(page.locator(DIALOGS_SELECTORS.MEDIA_ACTIONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_MEDIA_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.MEDIA_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('09-hide_dialog_media_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_MEDIA_ACTIONS, false);

});

test('Option: hide_dialog_climate_actions, hide_dialog_climate_temperature_actions and hide_dialog_climate_settings_actions', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.CLIMATE_ENTITY_ROW, TEXT_SELECTORS.CLIMATE).click();

	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CLIMATE_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeHidden();
	await expect(page).toHaveScreenshot('10-hide_dialog_climate_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CLIMATE_ACTIONS, false);

	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeVisible();
	await expect(page).toHaveScreenshot('11-hide_dialog_climate_temperature_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS, false);

	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeHidden();
	await expect(page).toHaveScreenshot('12-hide_dialog_climate_settings_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS, false);

	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS)).toBeVisible();

});

test('Option: hide_dialog_light_actions, hide_dialog_light_control_actions, hide_dialog_light_color_actions and hide_dialog_light_settings_actions', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.TOGGLE_ENTITY_ROW, TEXT_SELECTORS.LIGHT).click();

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('13-hide_dialog_light_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_ACTIONS, false);

	await page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS).scrollIntoViewIfNeeded();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();
	await expect(page).toHaveScreenshot('14-hide_dialog_light_control_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS, false);

	await page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS).scrollIntoViewIfNeeded();

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_COLOR_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeHidden();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();
	await expect(page).toHaveScreenshot('15-hide_dialog_light_color_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_COLOR_ACTIONS, false);

	await page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS).scrollIntoViewIfNeeded();

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('16-hide_dialog_light_settings_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS, false);

	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS)).toBeVisible();
	await expect(page.locator(DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS)).toBeVisible();

});

test('Option: hide_dialog_timer_actions', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.TIMER_ENTITY_ROW, TEXT_SELECTORS.TIMER).click();

	await expect(page.locator(DIALOGS_SELECTORS.TIMER_ACTIONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_TIMER_ACTIONS, true);

	await expect(page.locator(DIALOGS_SELECTORS.TIMER_ACTIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('17-hide_dialog_timer_actions.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_TIMER_ACTIONS, false);

});

test('Option: hide_dialog_history_show_more', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.HOME).click();

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_LINK)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_SHOW_MORE, true);

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_LINK)).toBeHidden();
	await expect(page).toHaveScreenshot('18-hide_dialog_history_show_more.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_SHOW_MORE, false);

});

test('Option: hide_dialog_logbook_show_more', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, TEXT_SELECTORS.BINARY_SENSOR).click();

	await expect(page.locator(DIALOGS_SELECTORS.LOGBOOK_LINK)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LOGBOOK_SHOW_MORE, true);

	await expect(page.locator(DIALOGS_SELECTORS.LOGBOOK_LINK)).toBeHidden();
	await expect(page).toHaveScreenshot('19-hide_dialog_logbook_show_more.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_LOGBOOK_SHOW_MORE, false);

});