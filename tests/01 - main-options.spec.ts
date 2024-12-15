import { test, expect } from 'playwright-test-coverage';
import path from 'path';
import { SELECTORS, ENTITIES } from './constants';
import { turnBooleanState, goToPage } from './utils';

test('Option: kiosk', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

	await turnBooleanState(page, ENTITIES.KIOSK, true);

	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('01-kiosk.png');

	await turnBooleanState(page, ENTITIES.KIOSK, false);

});

test('Option: hide_header', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_HEADER, true);

	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page).toHaveScreenshot('02-hide_header.png');

	await turnBooleanState(page, ENTITIES.HIDE_HEADER, false);

});

test('Option: hide_sidebar', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_SIDEBAR, true);

	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('03-hide_sidebar.png');

	await turnBooleanState(page, ENTITIES.HIDE_SIDEBAR, false);

});

test('Option: hide_menubutton', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.MENU_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_MENU_BUTTON, true);

	await expect(page.locator(SELECTORS.MENU_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('04-hide_menubutton.png');

	await turnBooleanState(page, ENTITIES.HIDE_MENU_BUTTON, false);

});

test('Option: hide_notifications', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.NOTIFICATIONS)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_NOTIFICATIONS, true);

	await expect(page.locator(SELECTORS.NOTIFICATIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('05-hide_notifications.png');

	await turnBooleanState(page, ENTITIES.HIDE_NOTIFICATIONS, false);

});

test('Option: hide_account', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.ACCOUNT)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_ACCOUNT, true);

	await expect(page.locator(SELECTORS.ACCOUNT)).toBeHidden();
	await expect(page).toHaveScreenshot('06-hide_account.png');

	await turnBooleanState(page, ENTITIES.HIDE_ACCOUNT, false);

});

test('Option: hide_notifications and hide_account at the same time', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.ACCOUNT)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_NOTIFICATIONS, true);
	await turnBooleanState(page, ENTITIES.HIDE_ACCOUNT, true);

	await expect(page).toHaveScreenshot('07-hide_notifications-and-hide_account.png');

	await turnBooleanState(page, ENTITIES.HIDE_NOTIFICATIONS, false);
	await turnBooleanState(page, ENTITIES.HIDE_ACCOUNT, false);

});

test('Option: hide_search', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.SEARCH_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_SEARCH, true);

	await expect(page.locator(SELECTORS.SEARCH_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('08-hide_search.png');

	await turnBooleanState(page, ENTITIES.HIDE_SEARCH, false);

});

test('Option: hide_assistant', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.ASSISTANT_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_ASSISTANT, true);

	await expect(page.locator(SELECTORS.ASSISTANT_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('09-hide_assistant.png');

	await turnBooleanState(page, ENTITIES.HIDE_ASSISTANT, false);

});

test('Option: hide_overflow', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_OVERFLOW, true);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('10-hide_overflow.png');

	await turnBooleanState(page, ENTITIES.HIDE_OVERFLOW, false);

});

test('Option: hide_refresh', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_REFRESH_ITEM)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_REFRESH, true);

	await expect(page.locator(SELECTORS.MENU_REFRESH_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('11-hide_refresh.png');

	await turnBooleanState(page, ENTITIES.HIDE_REFRESH, false);

});

test('Option: hide_unused_entities', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_UNUSED_ENTITIES_ITEM)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_UNUSED_ENTITIES, true);

	await expect(page.locator(SELECTORS.MENU_UNUSED_ENTITIES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('12-hide_unused_entities.png');

	await turnBooleanState(page, ENTITIES.HIDE_UNUSED_ENTITIES, false);

});

test('Option: hide_reload_resources', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_RELOAD_RESOURCES_ITEM)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_RELOAD_RESOURCES, true);

	await expect(page.locator(SELECTORS.MENU_RELOAD_RESOURCES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('13-hide_reload_resources.png');

	await turnBooleanState(page, ENTITIES.HIDE_RELOAD_RESOURCES, false);

});

test('Option: hide_edit_dashboard', async ({ page }) => {

	await goToPage(page);

	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();

	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_ITEM)).toBeVisible();

	await turnBooleanState(page, ENTITIES.HIDE_EDIT_DASHBOARD, true);

	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('14-hide_edit_dashboard.png');

	await turnBooleanState(page, ENTITIES.HIDE_EDIT_DASHBOARD, false);

});

test('Option: block_overflow', async ({ page }) => {

	await goToPage(page);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).not.toHaveCSS('pointer-events', 'none');

	await turnBooleanState(page, ENTITIES.BLOCK_OVERFLOW, true);

	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toHaveCSS('pointer-events', 'none');

	await turnBooleanState(page, ENTITIES.BLOCK_OVERFLOW, false);

});

test.describe('Option: block_context_menu', () => {

	test('Test contextmenu event listener', async ({ context, page }) => {

		await context.addInitScript({
			path: path.join(__dirname, '..', './node_modules/sinon/pkg/sinon.js'),
		});

		await context.addInitScript(() => {
			window['__listener'] = window['sinon'].fake();
			window.addEventListener('contextmenu', window['__listener']);
		});

		await goToPage(page);

		await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
		await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

		let executed = await page.evaluate(() => window['__listener'].calledOnce);

		await expect(executed).toBe(false);

		await page.locator(SELECTORS.HEADER).click({
			button: 'right'
		});

		executed = await page.evaluate(() => window['__listener'].calledOnce);

		await expect(executed).toBe(true);

		await turnBooleanState(page, ENTITIES.BLOCK_CONTEXT_MENU, true);

		await page.waitForTimeout(100);

		await page.locator(SELECTORS.HEADER).click({
			button: 'right'
		});

		executed = await page.evaluate(() => window['__listener'].calledTwice);

		await expect(executed).toBe(false);

		await turnBooleanState(page, ENTITIES.BLOCK_CONTEXT_MENU, false);

		await page.waitForTimeout(100);

		await page.locator(SELECTORS.HEADER).click({
			button: 'right'
		});

		executed = await page.evaluate(() => window['__listener'].calledTwice);

		await expect(executed).toBe(true);

	});
});

test('Option: debug and debug_template', async ({ page }) => {

	const messages: string[] = [];

	page.on('console', message => {
		if (
			['startGroup', 'startGroupCollapsed', 'endGroup', 'warning', 'info', 'table'].includes(message.type())
		) {
			messages.push(message.text());
		}
	});

	await goToPage(page);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();
	await page.waitForTimeout(1500);

	expect(messages).toEqual(
		expect.arrayContaining([
			'kiosk-mode raw config for lovelace panel',
			'The template debug has been triggered with the next template:',
			'%c[[[ is_state(\'input_boolean.kiosk\', \'on\') ? \'yes\' : \'no\' ]]] color: #666',
			'The evaluation of this template is: %cno font-weight: bold; color: red;',
			'%c⚠️ This template doesn\'t return a boolean. It cannot be used as a kiosk-mode option. text-decoration: underline'
		])
	);

});