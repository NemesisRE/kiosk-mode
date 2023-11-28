import { BASE_URL } from '../constants';

export const haRequest = (entity: string, state: boolean) => {
	return fetch(
		`${BASE_URL}/api/services/input_boolean/turn_${state ? 'on' : 'off'}`,
		{
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${process.env.HA_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				entity_id: `input_boolean.${entity}`
			})
		}
	);
};

export const getUrlWithParam = (param: string) => `${BASE_URL}?${param}`;