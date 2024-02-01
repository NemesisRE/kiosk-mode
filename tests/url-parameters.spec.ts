import { test, expect } from 'playwright-test-coverage';
import {
	URL_PARAMS,
	SELECTORS,
	ENTITIES
} from './constants';
import { getUrlWithParam, haRequest } from './utils';

test('URL Parameter: ?kiosk', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.KIOSK
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('01-kiosk.png');

});

test('URL Parameter: ?hide_header', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_HEADER
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
	await expect(page).toHaveScreenshot('02-hide_header.png');

});

test('URL Parameter: ?hide_sidebar', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_SIDEBAR
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
	await expect(page).toHaveScreenshot('03-hide_sidebar.png');

});

test('URL Parameter: ?hide_menubutton', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_MENU_BUTTON
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.MENU_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('04-hide_menubutton.png');

});

test('URL Parameter: ?hide_notifications', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_NOTIFICATIONS
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.NOTIFICATIONS)).toBeHidden();
	await expect(page).toHaveScreenshot('05-hide_notifications.png');

});

test('URL Parameter: ?hide_account', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_ACCOUNT
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.ACCOUNT)).toBeHidden();
	await expect(page).toHaveScreenshot('06-hide_account.png');

});

test('URL Parameter: ?hide_search', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_SEARCH
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.SEARCH_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('07-hide_search.png');

});

test('URL Parameter: ?hide_assistant', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_ASSISTANT
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.ASSISTANT_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('08-hide_assistant.png');

});

test('URL Parameter: ?hide_overflow', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_OVERFLOW
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
	await expect(page).toHaveScreenshot('09-hide_overflow.png');

});

test('URL Parameter: ?hide_refresh', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_REFRESH
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_REFRESH_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('10-hide_refresh.png');

});

test('URL Parameter: ?hide_unused_entities', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_UNUSED_ENTITIES
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_UNUSED_ENTITIES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('11-hide_unused_entities.png');

});

test('URL Parameter: ?hide_reload_resources', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_RELOAD_RESOURCES
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_RELOAD_RESOURCES_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('12-hide_reload_resources.png');

});

test('URL Parameter: ?hide_edit_dashboard', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.HIDE_EDIT_DASHBOARD
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_ITEM)).toBeHidden();
	await expect(page).toHaveScreenshot('13-hide_edit_dashboard.png');

});

test('URL Parameter: ?block_overflow', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.BLOCK_OVERFLOW
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toHaveCSS('pointer-events', 'none');

});

test('URL Parameter: ?disable_km', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.DISABLE_KM
		)
	);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

	await haRequest(ENTITIES.KIOSK, true);

	await expect(page.locator(SELECTORS.HEADER)).not.toBeHidden();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).not.toBeHidden();

	await haRequest(ENTITIES.KIOSK, false);

	await expect(page.locator(SELECTORS.HEADER)).toBeVisible();
	await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();

});