import { test, expect } from 'playwright-test-coverage';
import { URL_PARAMS, SELECTORS } from './constants';
import { getUrlWithParam, goToPage } from './utils';

[
	{
		param: URL_PARAMS.KIOSK,
		selector: [
			SELECTORS.HEADER,
			SELECTORS.HA_SIDEBAR
		]
	},
	{
		param: URL_PARAMS.HIDE_HEADER,
		selector: SELECTORS.HEADER

	},
	{
		param: URL_PARAMS.HIDE_SIDEBAR,
		selector: SELECTORS.HA_SIDEBAR
	},
	{
		param: URL_PARAMS.HIDE_MENU_BUTTON,
		selector: SELECTORS.MENU_BUTTON
	},
	{
		param: URL_PARAMS.HIDE_NOTIFICATIONS,
		selector: SELECTORS.NOTIFICATIONS
	},
	{
		param: URL_PARAMS.HIDE_ACCOUNT,
		selector: SELECTORS.ACCOUNT
	},
	{
		param: URL_PARAMS.HIDE_SEARCH,
		selector: SELECTORS.SEARCH_BUTTON
	},
	{
		param: URL_PARAMS.HIDE_ASSISTANT,
		selector: SELECTORS.ASSISTANT_BUTTON
	},
	{
		param: URL_PARAMS.HIDE_OVERFLOW,
		selector: SELECTORS.OVERFLOW_BUTTON
	}
].forEach(({ param, selector }) => {

	const selectors = Array.isArray(selector)
		? selector
		: [selector];

	test(`Caching URL Parameter: ?${param}`, async ({ page }) => {

		await page.goto(
			getUrlWithParam(
				param,
				URL_PARAMS.CACHE
			)
		);

		await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();

		selectors.forEach(async (selector) => {
			await expect(page.locator(selector)).toBeHidden();
		});

		await goToPage(page);

		await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();

		selectors.forEach(async (selector) => {
			await expect(page.locator(selector)).toBeHidden();
		});

		await page.goto(
			getUrlWithParam(
				URL_PARAMS.CLEAR_KM_CACHE
			)
		);

		await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();

		selectors.forEach(async (selector) => {
			await expect(page.locator(selector)).toBeVisible();
		});

	});

});

[
	{
		param: URL_PARAMS.HIDE_REFRESH,
		selector: SELECTORS.MENU_REFRESH_ITEM
	},
	{
		param: URL_PARAMS.HIDE_UNUSED_ENTITIES,
		selector: SELECTORS.MENU_UNUSED_ENTITIES_ITEM
	},
	{
		param: URL_PARAMS.HIDE_RELOAD_RESOURCES,
		selector: SELECTORS.MENU_RELOAD_RESOURCES_ITEM
	},
	{
		param: URL_PARAMS.HIDE_EDIT_DASHBOARD,
		selector: SELECTORS.MENU_EDIT_DASHBOARD_ITEM
	}
].forEach(({ param, selector }) => {

	test(`Caching URL Parameter: ?${param}`, async ({ page }) => {

		await page.goto(
			getUrlWithParam(
				param,
				URL_PARAMS.CACHE
			)
		);

		await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
		await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
		await expect(page.locator(selector)).toBeHidden();

		await goToPage(page);

		await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
		await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
		await expect(page.locator(selector)).toBeHidden();

		await page.goto(
			getUrlWithParam(
				URL_PARAMS.CLEAR_KM_CACHE
			)
		);

		await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
		await page.locator(SELECTORS.OVERFLOW_BUTTON).click();
		await expect(page.locator(selector)).toBeVisible();

	});

});

test('Caching URL Parameter: ?block_overflow', async ({ page }) => {

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.BLOCK_OVERFLOW,
			URL_PARAMS.CACHE
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toHaveCSS('pointer-events', 'none');

	await goToPage(page);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toHaveCSS('pointer-events', 'none');

	await page.goto(
		getUrlWithParam(
			URL_PARAMS.CLEAR_KM_CACHE
		)
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).not.toHaveCSS('pointer-events', 'none');

});