import { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { BASE_URL, SELECTORS } from '../constants';

interface Context {
    id: string;
    user_id: string;
}

interface HomeAssistant extends HTMLElement {
    hass: {
        callService: (domain: string, service: string, data: Record<string, unknown>) => Promise<Context>;
		connected: boolean;
    };
}

export const goToPage = async (page: Page) => {
	await page.goto('/');
	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
};

export const goToPageWithParams = async (page: Page, ...params: string[]) => {
	await page.goto(
		getUrlWithParam(...params)
	);
	await expect(page.locator('hui-view')).toBeVisible();
};

export const turnBooleanState = async (
	page: Page,
	entity: string,
	state: boolean
) => {
	await page.evaluate(async ({ entity, state }) => {
		const homeAssistant = document.querySelector('home-assistant') as HomeAssistant;
		await homeAssistant.hass.callService(
			'input_boolean',
			`turn_${state ? 'on' : 'off'}`,
			{
				entity_id: `input_boolean.${entity}`
			}
		);
	}, { entity, state });
	await page.waitForTimeout(100);
};

export const changeToStorageMode = async (page: Page) => {

	await page.route('**', route => route.continue());
	await goToPage(page);

	await page.evaluate(async () => {
		const homeAssistant = document.querySelector('home-assistant') as HomeAssistant;
		await homeAssistant.hass.callService(
			'shell_command',
			'change_to_storage_mode',
			{}
		);
		await homeAssistant.hass.callService(
			'homeassistant',
			'restart',
			{}
		);
	});

	await page.evaluate(async () => {
		const homeAssistant = document.querySelector('home-assistant') as HomeAssistant;
		await new Promise<void>((resolve, reject) => {
			const checkDelay = 1000;
			const checksLimit = 10;
			const checkConnection = (retries = 0) => {
				if (homeAssistant.hass.connected) {
					resolve();
				} else {
					if (retries === checksLimit) {
						reject();
					} else {
						setTimeout(() => {
							checkConnection(retries + 1);
						}, checkDelay);
					}
				}
			};
			checkConnection();
		});
	});
	await expect(page.locator(SELECTORS.TOAST)).not.toBeVisible();
	await page.reload();
	await expect(page.locator(SELECTORS.HUI_MASONRY_VIEW)).toBeVisible();
	await page.unrouteAll({ behavior: 'ignoreErrors' });

};

export const getUrlWithParam = (...params: string[]) => `${BASE_URL}?${params.join('&')}`;