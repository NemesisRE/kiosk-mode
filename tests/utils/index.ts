import { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { BASE_URL } from '../constants';

interface Context {
    id: string;
    user_id: string;
}

interface HomeAssistant extends HTMLElement {
    hass: {
        callService: (domain: string, service: string, data: Record<string, unknown>) => Promise<Context>;
    };
}

export const goToPage = async (page: Page) => {
	await page.goto('/');
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
};

export const getUrlWithParam = (...params: string[]) => `${BASE_URL}?${params.join('&')}`;