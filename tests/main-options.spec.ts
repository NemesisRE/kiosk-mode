import { test, expect } from 'playwright-test-coverage';
import path from 'path';
import {
	BASE_URL,
	SELECTORS,
	ENTITIES
} from './constants';
import { haRequest } from './utils';

test('Option: kiosk', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

	await haRequest(ENTITIES.KIOSK, true);

	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('01-kiosk.png');

	await haRequest(ENTITIES.KIOSK, false);

});

test('Option: hide_header', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();

	await haRequest(ENTITIES.HIDE_HEADER, true);

	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page).toHaveScreenshot('02-hide_header.png');

	await haRequest(ENTITIES.HIDE_HEADER, false);

});

test('Option: hide_sidebar', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

	await haRequest(ENTITIES.HIDE_SIDEBAR, true);

	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('03-hide_sidebar.png');

	await haRequest(ENTITIES.HIDE_SIDEBAR, false);

});

test('Option: hide_menubutton', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.MENU_BUTTON)).toBeVisible();

	await haRequest(ENTITIES.HIDE_MENU_BUTTON, true);

	await expect(page.locator(SELECTORS.MENU_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('04-hide_menubutton.png');

	await haRequest(ENTITIES.HIDE_MENU_BUTTON, false);

});

test('Option: hide_notifications', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.NOTIFICATIONS)).toBeVisible();

	await haRequest(ENTITIES.HIDE_NOTIFICATIONS, true);

	await expect(page.locator(SELECTORS.NOTIFICATIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('05-hide_notifications.png');

	await haRequest(ENTITIES.HIDE_NOTIFICATIONS, false);

});

test('Option: hide_account', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.ACCOUNT)).toBeVisible();

	await haRequest(ENTITIES.HIDE_ACCOUNT, true);

	await expect(page.locator(SELECTORS.ACCOUNT)).toBeHidden();
	await expect(page).toHaveScreenshot('06-hide_account.png');

	await haRequest(ENTITIES.HIDE_ACCOUNT, false);

});

test('Option: hide_search', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.SEARCH_BUTTON)).toBeVisible();

	await haRequest(ENTITIES.HIDE_SEARCH, true);

	await expect(page.locator(SELECTORS.SEARCH_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('07-hide_search.png');

	await haRequest(ENTITIES.HIDE_SEARCH, false);

});

test('Option: hide_assistant', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.ASSISTANT_BUTTON)).toBeVisible();

	await haRequest(ENTITIES.HIDE_ASSISTANT, true);

	await expect(page.locator(SELECTORS.ASSISTANT_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('08-hide_assistant.png');

	await haRequest(ENTITIES.HIDE_ASSISTANT, false);

});

test('Option: hide_overflow', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toBeVisible();

	await haRequest(ENTITIES.HIDE_OVERFLOW, true);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('09-hide_overflow.png');

	await haRequest(ENTITIES.HIDE_OVERFLOW, false);

});

test('Option: hide_refresh', async ({ page }) => {

	await page.goto(BASE_URL);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_REFRESH_ITEM)).toBeVisible();

	await haRequest(ENTITIES.HIDE_REFRESH, true);

	await expect(page.locator(SELECTORS.MENU_REFRESH_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('10-hide_refresh.png');

	await haRequest(ENTITIES.HIDE_REFRESH, false);

});

test('Option: hide_unused_entities', async ({ page }) => {

	await page.goto(BASE_URL);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_UNUSED_ENTITIES_ITEM)).toBeVisible();

	await haRequest(ENTITIES.HIDE_UNUSED_ENTITIES, true);

	await expect(page.locator(SELECTORS.MENU_UNUSED_ENTITIES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('11-hide_unused_entities.png');

	await haRequest(ENTITIES.HIDE_UNUSED_ENTITIES, false);

});

test('Option: hide_reload_resources', async ({ page }) => {

	await page.goto(BASE_URL);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_RELOAD_RESOURCES_ITEM)).toBeVisible();

	await haRequest(ENTITIES.HIDE_RELOAD_RESOURCES, true);

	await expect(page.locator(SELECTORS.MENU_RELOAD_RESOURCES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('12-hide_reload_resources.png');

	await haRequest(ENTITIES.HIDE_RELOAD_RESOURCES, false);

});

test('Option: hide_edit_dashboard', async ({ page }) => {

	await page.goto(BASE_URL);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_ITEM)).toBeVisible();

	await haRequest(ENTITIES.HIDE_EDIT_DASHBOARD, true);

	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('13-hide_edit_dashboard.png');

	await haRequest(ENTITIES.HIDE_EDIT_DASHBOARD, false);

});

test('Option: block_overflow', async ({ page }) => {

	await page.goto(BASE_URL);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).not.toHaveCSS('pointer-events', 'none');

	await haRequest(ENTITIES.BLOCK_OVERFLOW, true);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toHaveCSS('pointer-events', 'none');

	await haRequest(ENTITIES.BLOCK_OVERFLOW, false);

});

test.describe('Option: block_context_menu', () => {
	test.beforeEach(async ({ context }) => {
		await context.addInitScript({
			path: path.join(__dirname, '..', './node_modules/sinon/pkg/sinon.js'),
		});
		await context.addInitScript(() => {
			window['__listener'] = window['sinon'].fake();
			window.addEventListener('contextmenu', window['__listener']);
		});
	});
	test('Test contextmenu event listener', async ({ page }) => {

		await page.goto(BASE_URL);

		await expect(page.locator(SELECTORS.HEADER)).toBeVisible();

		let executed = await page.evaluate(() => window['__listener'].calledOnce);

		await expect(executed).toBe(false);

		await page.locator(SELECTORS.HEADER).click({
			button: 'right'
		});

		executed = await page.evaluate(() => window['__listener'].calledOnce);

		await expect(executed).toBe(true);

		await haRequest(ENTITIES.BLOCK_CONTEXT_MENU, true);

		await page.locator(SELECTORS.HEADER).click({
			button: 'right'
		});

		executed = await page.evaluate(() => window['__listener'].calledTwice);

		await expect(executed).toBe(false);

		await haRequest(ENTITIES.BLOCK_CONTEXT_MENU, false);

		await page.locator(SELECTORS.HEADER).click({
			button: 'right'
		});

		executed = await page.evaluate(() => window['__listener'].calledTwice);

		await expect(executed).toBe(true);

	});
});