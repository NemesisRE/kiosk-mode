import { test, expect } from 'playwright-test-coverage';
import { SELECTORS } from './constants';
import { changeToStorageMode } from './utils';

test('Option: hide_edit_dashboard in storage mode', async ({ page }) => {

	await changeToStorageMode(page);

	// Create a new storage dashboard
	await page.goto('/config/lovelace/dashboards');
	await expect(page.locator(SELECTORS.DASHBOARDS_PANEL)).toBeVisible();
	await page.locator(SELECTORS.ADD_DASHBOARD_BUTTON).click();
	await expect(page.locator(SELECTORS.ADD_DASHBOARD_DIALOG)).toBeVisible();
	await page.locator(SELECTORS.NEW_DASHBOARD_CARD).click();

	const newDashboardDialog = page.locator(SELECTORS.ADD_NEW_DASHBOARD_DIALOG);

	await expect(newDashboardDialog).toBeVisible();
	await newDashboardDialog.locator(SELECTORS.ADD_NEW_DASBOARD_TITLE).fill('Test');
	await newDashboardDialog.locator(SELECTORS.ADD_NEW_DASHBOARD_ICON).click();
	await newDashboardDialog.locator(SELECTORS.ADD_NEW_DASHBOARD_ICON_LIST).click();
	await page.locator(SELECTORS.ADD_NEW_DASHBOARD_BUTTON).click();
	await expect(newDashboardDialog).not.toBeInViewport();

	// Go to the storage dashboard with hide_edit_dashboard in the URL
	await page.goto('/dashboard-test?hide_edit_dashboard');
	await expect(page.locator(SELECTORS.HUI_SECTIONS_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_PENCIL)).not.toBeVisible();

	// Go to the storage dashboard without hide_edit_dashboard in the URL
	await page.goto('/dashboard-test');
	await expect(page.locator(SELECTORS.HUI_SECTIONS_VIEW)).toBeVisible();
	await page.locator(SELECTORS.MENU_EDIT_DASHBOARD_PENCIL).click();
	await expect(page.locator(SELECTORS.EXIT_EDIT_MODE)).toBeVisible();
	await page.locator(SELECTORS.OVERFLOW_MENU_EDIT_MODE).click();
	await page.getByRole('menuitem', { name: 'Raw configuration editor' }).click();
	const codeEditor = page.locator(SELECTORS.CODE_EDITOR);
	await codeEditor.click();
	await codeEditor.press('ArrowUp');
	await codeEditor.press('ArrowUp');
	await codeEditor.press('ArrowUp');
	await codeEditor.press('ArrowUp');
	await codeEditor.press('ArrowUp');
	await codeEditor.press('ArrowUp');
	await codeEditor.press('ArrowUp');
	await codeEditor.pressSequentially('kiosk_mode:');
	await codeEditor.press('Enter');
	await codeEditor.press('Tab');
	await codeEditor.pressSequentially('hide_edit_dashboard: true');
	await codeEditor.press('Enter');
	await codeEditor.press('Backspace');
	await page.locator(SELECTORS.SAVE_BUTTON).click();
	await page.locator(SELECTORS.CLOSE_EDIT_MODE).click();
	await page.locator(SELECTORS.EXIT_EDIT_MODE).click();
	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_PENCIL)).toBeVisible();

	await page.reload();
	await expect(page.locator(SELECTORS.HUI_SECTIONS_VIEW)).toBeVisible();
	await expect(page.locator(SELECTORS.MENU_EDIT_DASHBOARD_PENCIL)).not.toBeVisible();

});