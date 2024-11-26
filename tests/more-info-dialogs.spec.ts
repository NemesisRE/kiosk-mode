import { test, expect } from 'playwright-test-coverage';
import {
	SELECTORS,
	DIALOGS_SELECTORS,
	ENTITIES
} from './constants';
import { turnBooleanState, goToPage } from './utils';

const sunText = { hasText: 'Sun' };
const homeText = { hasText: 'Home' };
const attributesTest = { hasText: 'Attributes' };

test('Option: hide_dialog_header_history', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, sunText).click();

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_BUTTON, true);

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('01-hide_dialog_header_history.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_BUTTON, false);

});

test('Option: hide_dialog_header_settings', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, sunText).click();

	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_SETTINGS_BUTTON, true);

	await expect(page.locator(DIALOGS_SELECTORS.SETTINGS_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('02-hide_dialog_header_settings.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_SETTINGS_BUTTON, false);

});

test('Option: hide_dialog_header_overflow', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, sunText).click();
	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_OVERFLOW_BUTTON, true);

	await expect(page.locator(DIALOGS_SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('03-hide_dialog_header_overflow.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_OVERFLOW_BUTTON, false);

});

test('Option: hide_dialog_header_action_items', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, sunText).click();

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

	await page.locator(SELECTORS.ENTITY_ROW, homeText).click();

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY, true);

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY)).toBeHidden();
	await expect(page).toHaveScreenshot('05-hide_dialog_history.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY, false);

});

test('Option: hide_dialog_attributes', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, homeText).click();

	await expect(page.locator(DIALOGS_SELECTORS.ATTRIBUTES, attributesTest)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_ATTRIBUTES, true);

	await expect(page.locator(DIALOGS_SELECTORS.ATTRIBUTES, attributesTest)).toBeHidden();
	await expect(page).toHaveScreenshot('06-hide_dialog_attributes.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_ATTRIBUTES, false);

});

test('Option: hide_dialog_history_show_more', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.ENTITY_ROW, homeText).click();

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_LINK)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_SHOW_MORE, true);

	await expect(page.locator(DIALOGS_SELECTORS.HISTORY_LINK)).toBeHidden();
	await expect(page).toHaveScreenshot('07-hide_dialog_history_show_more.png');

	await turnBooleanState(page, ENTITIES.HIDE_DIALOG_HISTORY_SHOW_MORE, false);

});