import { test, expect } from 'playwright-test-coverage';
import { DIALOGS_SELECTORS, ENTITIES } from './constants';

test('More-info dialog on a non-Lovelace panel does not crash kiosk-mode', async ({ page }) => {

	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));

	// On a non-Lovelace panel ON_LOVELACE_PANEL_LOAD never fires, so kiosk-mode's
	// "this.ha" is never set. Give the frontend a moment to settle, then opening
	// a more-info dialog here must not throw.
	await page.goto('/history');
	await page.waitForTimeout(2000);

	await page.evaluate((entityId) => {
		document.querySelector('home-assistant')?.dispatchEvent(
			new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true })
		);
	}, `input_boolean.${ENTITIES.KIOSK}`);

	await expect(page.locator(DIALOGS_SELECTORS.MORE_INFO_INFO)).toBeVisible();

	expect(errors).toEqual([]);

});
