import { test, expect } from 'playwright-test-coverage';
import path from 'path';
import {
	URL_PARAMS,
	SELECTORS,
	DIALOGS_SELECTORS,
	TEXT_SELECTORS
} from './constants';
import { goToPageWithParams, goToPage } from './utils';

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
		param: URL_PARAMS.HIDE_CONFIG,
		selector: SELECTORS.CONFIG
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
		param: URL_PARAMS.HIDE_ADD_TO_HOME_ASSISTANT,
		selector: SELECTORS.ADD_TO_HOME_ASSISTANT
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

		const masonryView = page.locator(SELECTORS.HUI_MASONRY_VIEW);

		await goToPageWithParams(page, param, URL_PARAMS.CACHE);

		await expect(masonryView).toBeVisible();

		for (const selector of selectors) {
			await expect(page.locator(selector)).toBeHidden();
		}

		await goToPage(page);

		await expect(masonryView).toBeVisible();

		for (const selector of selectors) {
			await expect(page.locator(selector)).toBeHidden();
		}

		await goToPageWithParams(page, URL_PARAMS.CLEAR_KM_CACHE);

		await expect(masonryView).toBeVisible();

		for (const selector of selectors) {
			await expect(page.locator(selector)).toBeVisible();
		}

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

		const masonryView = page.locator(SELECTORS.HUI_MASONRY_VIEW);
		const overflowButton = page.locator(SELECTORS.OVERFLOW_BUTTON);

		await goToPageWithParams(page, param, URL_PARAMS.CACHE);

		await expect(masonryView).toBeVisible();

		await overflowButton.click();

		await expect(page.locator(selector)).toBeHidden();

		await goToPage(page);

		await expect(masonryView).toBeVisible();

		await overflowButton.click();

		await expect(page.locator(selector)).toBeHidden();

		await goToPageWithParams(page, URL_PARAMS.CLEAR_KM_CACHE);

		await expect(masonryView).toBeVisible();

		await overflowButton.click();

		await expect(page.locator(selector)).toBeVisible();

	});

});

[
	{
		param: URL_PARAMS.HIDE_DIALOG_HEADER_BREADCRUMB_NAVIGATION,
		selector: DIALOGS_SELECTORS.BREADCRUMB_NAVIGATION,
		entitySelector: SELECTORS.ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.BINARY_SENSOR
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_HEADER_HISTORY,
		selector: DIALOGS_SELECTORS.HISTORY_BUTTON,
		entitySelector: SELECTORS.UPDATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.ADDON
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_HEADER_SETTINGS,
		selector: DIALOGS_SELECTORS.SETTINGS_BUTTON,
		entitySelector: SELECTORS.UPDATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.ADDON
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_HEADER_OVERFLOW,
		selector: DIALOGS_SELECTORS.OVERFLOW_BUTTON,
		entitySelector: SELECTORS.UPDATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.ADDON
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_HEADER_ACTION_ITEMS,
		selector: [
			DIALOGS_SELECTORS.HISTORY_BUTTON,
			DIALOGS_SELECTORS.SETTINGS_BUTTON,
			DIALOGS_SELECTORS.OVERFLOW_BUTTON
		],
		entitySelector: SELECTORS.UPDATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.ADDON
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_HISTORY,
		selector: DIALOGS_SELECTORS.HISTORY,
		entitySelector: SELECTORS.ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.HOME
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_LOGBOOK,
		selector: DIALOGS_SELECTORS.LOGBOOK,
		entitySelector: SELECTORS.ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.BINARY_SENSOR
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_UPDATE_ACTIONS,
		selector: DIALOGS_SELECTORS.UPDATE_ACTIONS,
		entitySelector: SELECTORS.UPDATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.ADDON
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_CAMERA_ACTIONS,
		selector: DIALOGS_SELECTORS.CAMERA_ACTIONS,
		entitySelector: SELECTORS.ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.CAMERA
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_MEDIA_ACTIONS,
		selector: [
			DIALOGS_SELECTORS.MEDIA_ACTIONS_MAIN,
			DIALOGS_SELECTORS.MEDIA_ACTIONS_SECONDARY
		],
		entitySelector: SELECTORS.MEDIA_PLAYER_ENTITY_ROW
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_CLIMATE_ACTIONS,
		selector: [
			DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS,
			DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS
		],
		entitySelector: SELECTORS.CLIMATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.CLIMATE
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS,
		selector: DIALOGS_SELECTORS.CLIMATE_TEMPERATURE_BUTTONS,
		entitySelector: SELECTORS.CLIMATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.CLIMATE
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS,
		selector: DIALOGS_SELECTORS.CLIMATE_SETTINGS_BUTTONS,
		entitySelector: SELECTORS.CLIMATE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.CLIMATE
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_LIGHT_ACTIONS,
		selector: [
			DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS,
			DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS,
			DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS
		],
		entitySelector: SELECTORS.TOGGLE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.LIGHT
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS,
		selector: DIALOGS_SELECTORS.LIGHT_CONTROL_ACTIONS,
		entitySelector: SELECTORS.TOGGLE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.LIGHT
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_LIGHT_COLOR_ACTIONS,
		selector: DIALOGS_SELECTORS.LIGHT_COLOR_ACTIONS,
		entitySelector: SELECTORS.TOGGLE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.LIGHT
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS,
		selector: DIALOGS_SELECTORS.LIGHT_SETTINGS_ACTIONS,
		entitySelector: SELECTORS.TOGGLE_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.LIGHT
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_TIMER_ACTIONS,
		selector: DIALOGS_SELECTORS.TIMER_ACTIONS,
		entitySelector: SELECTORS.TIMER_ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.TIMER
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_HISTORY_SHOW_MORE,
		selector: DIALOGS_SELECTORS.HISTORY_LINK,
		entitySelector: SELECTORS.ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.HOME
	},
	{
		param: URL_PARAMS.HIDE_DIALOG_LOGBOOK_SHOW_MORE,
		selector: DIALOGS_SELECTORS.LOGBOOK_LINK,
		entitySelector: SELECTORS.ENTITY_ROW,
		entitySelectorText: TEXT_SELECTORS.BINARY_SENSOR
	}
].forEach(({ param, selector, entitySelector, entitySelectorText }) => {

	const selectors = Array.isArray(selector)
		? selector
		: [selector];

	test(`Caching URL Parameter: ?${param}`, async ({ page }) => {

		const masonryView = page.locator(SELECTORS.HUI_MASONRY_VIEW);
		const moreInfoDialog = page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO);

		await goToPageWithParams(page, param, URL_PARAMS.CACHE);

		await expect(masonryView).toBeVisible();

		if (entitySelectorText) {
			await page.locator(entitySelector, entitySelectorText).click();
		} else {
			await page.locator(entitySelector).click();
		}

		await expect(moreInfoDialog).toBeVisible();

		for (const selector of selectors) {
			await expect(page.locator(selector)).toBeHidden();
		}

		await goToPage(page);

		await expect(masonryView).toBeVisible();

		if (entitySelectorText) {
			await page.locator(entitySelector, entitySelectorText).click();
		} else {
			await page.locator(entitySelector).click();
		}

		await expect(moreInfoDialog).toBeVisible();

		for (const selector of selectors) {
			await expect(page.locator(selector)).toBeHidden();
		}

		await goToPageWithParams(page, URL_PARAMS.CLEAR_KM_CACHE);

		await expect(masonryView).toBeVisible();

		if (entitySelectorText) {
			await page.locator(entitySelector, entitySelectorText).click();
		} else {
			await page.locator(entitySelector).click();
		}

		await expect(moreInfoDialog).toBeVisible();

		for (const selector of selectors) {
			await expect(page.locator(selector)).toBeVisible();
		}

	});

});

test('Caching URL Parameter: ?block_overflow', async ({ page }) => {

	const masonryView = page.locator(SELECTORS.HUI_MASONRY_VIEW);
	const overflowButton = page.locator(SELECTORS.OVERFLOW_BUTTON);

	await goToPageWithParams(page, URL_PARAMS.BLOCK_OVERFLOW, URL_PARAMS.CACHE);

	await expect(masonryView).toBeVisible();
	await expect(overflowButton).toHaveCSS('pointer-events', 'none');

	await goToPage(page);

	await expect(masonryView).toBeVisible();
	await expect(overflowButton).toHaveCSS('pointer-events', 'none');

	await goToPageWithParams(page, URL_PARAMS.CLEAR_KM_CACHE);

	await expect(masonryView).toBeVisible();
	await expect(overflowButton).not.toHaveCSS('pointer-events', 'none');

});

test('Caching URL Parameter: ?block_context_menu', async ({ context, page }) => {

	await context.addInitScript({
		path: path.join(__dirname, '..', './node_modules/sinon/pkg/sinon.js'),
	});

	await context.addInitScript(() => {
		window.__listener = window.sinon.fake();
		window.addEventListener('contextmenu', window.__listener);
	});

	await goToPageWithParams(
		page,
		URL_PARAMS.BLOCK_CONTEXT_MENU,
		URL_PARAMS.CACHE
	);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();

	await page.locator(SELECTORS.HEADER).click({
		button: 'right'
	});

	let executed = await page.evaluate(() => window.__listener.calledOnce);

	await expect(executed).toBe(false);

	await goToPage(page);

	await page.locator(SELECTORS.HEADER).click({
		button: 'right'
	});

	executed = await page.evaluate(() => window.__listener.calledOnce);

	await expect(executed).toBe(false);

	await goToPageWithParams(page, URL_PARAMS.CLEAR_KM_CACHE);

	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();

	await page.locator(SELECTORS.HEADER).click({
		button: 'right'
	});

	executed = await page.evaluate(() => window.__listener.calledOnce);

	await expect(executed).toBe(true);

});
