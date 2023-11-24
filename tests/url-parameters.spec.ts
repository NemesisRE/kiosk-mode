import { test, expect } from '@playwright/test';
import { URL_PARAMS, SELECTORS } from './constants';
import { getUrlWithParam } from './utils';

test('URL Parameter: ?kiosk', async ({ page }) => {
  
    await page.goto(
        getUrlWithParam(
            URL_PARAMS.KIOSK
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
    await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
    await expect(page).toHaveScreenshot('kiosk.png');

});

test('URL Parameter: ?hide_header', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_HEADER
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.HEADER)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_header.png');

});

test('URL Parameter: ?hide_sidebar', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_SIDEBAR
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_sidebar.png');

});

test('URL Parameter: ?hide_menubutton', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_MENU_BUTTON
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.MENU_BUTTON)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_menubutton.png');

});

test('URL Parameter: ?hide_notifications', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_NOTIFICATIONS
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.NOTIFICATIONS)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_notifications.png');

});

test('URL Parameter: ?hide_account', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_ACCOUNT
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.ACCOUNT)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_account.png');

});

test('URL Parameter: ?hide_search', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_SEARCH
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.SEARCH_BUTTON)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_search.png');

});

test('URL Parameter: ?hide_assistant', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_ASSISTANT
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.ASSISTANT_BUTTON)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_assistant.png');

});

test('URL Parameter: ?hide_overflow', async ({ page }) => {

    await page.goto(
        getUrlWithParam(
            URL_PARAMS.HIDE_OVERFLOW
        )
    );

    await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();	
    await expect(page.locator(SELECTORS.OVERFLOW_BUTTON)).toBeHidden();
    await expect(page).toHaveScreenshot('hide_overflow.png');

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
    await expect(page).toHaveScreenshot('hide_refresh.png');

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
    await expect(page).toHaveScreenshot('hide_unused_entities.png');

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
    await expect(page).toHaveScreenshot('hide_reload_resources.png');

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
    await expect(page).toHaveScreenshot('hide_edit_dashboard.png');

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