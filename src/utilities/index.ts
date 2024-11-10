import { HomeAssistant, Version } from '@types';
import {
	TRUE,
	MENU_REFERENCES,
	MAX_ATTEMPTS,
	RETRY_DELAY,
	ELEMENT,
	OPTION
} from '@constants';

// Get cache key
export const getCacheKey = (option: string): string => {
	const optionCamelCase = option.replace(/(?:^|_)([a-z])/g, (__match: string, letter): string => {
		return letter.toUpperCase();
	});
	return `km${optionCamelCase}`;
};

// Return true if keyword is found in query strings.
export const queryString = (...keywords: string[]): boolean => {
	const params = new URLSearchParams(window.location.search);
	return keywords.some((x) => params.has(x));
};

// Set localStorage item.
export const setCache = (value: string, ...options: OPTION[]): void => {
	options.forEach(
		(option) => window.localStorage.setItem(
			getCacheKey(option),
			value
		)
	);
};

// Retrieve localStorage item as bool.
export const cached = (...options: OPTION[]): boolean => {
	return options.some((option) => {
		return window.localStorage.getItem(getCacheKey(option)) === TRUE;
	});
};

// Reset all cache items to false
export const resetCache = () => {
	Object.values(OPTION).forEach((option: OPTION): void => {
		window.localStorage.removeItem(
			getCacheKey(option)
		);
	});
};

export const getDisplayNoneRules = (...rules: string[]): Record<string, false> => {
	return Object.fromEntries(
		rules.map((rule: string): [string, false] => [rule, false])
	);
};

const getHAResources = (ha: HomeAssistant): Promise<Record<string, Record<string, string>>> => {
	let attempts = 0;
	const referencePaths = Object.values(MENU_REFERENCES);
	return new Promise((resolve, reject) => {
		const getResources = () => {
			const resources = ha?.hass?.resources;
			let success = false;
			if (resources) {
				const language = ha.hass.language;
				// check if all the resources are available
				const anyEmptyResource = referencePaths.find((path: string) => {
					if (resources[language][path]) {
						return false;
					}
					return true;
				});
				if (!anyEmptyResource) {
					success = true;
				}
			}
			if (success) {
				resolve(resources);
			} else {
				attempts++;
				if (attempts < MAX_ATTEMPTS) {
					setTimeout(getResources, RETRY_DELAY);
				} else {
					reject();
				}
			}
		};
		getResources();
	});
};

export const getMenuTranslations = async(
	ha: HomeAssistant
): Promise<Record<string, string>> => {
	const resources = await getHAResources(ha);
	const language = ha.hass.language;
	const resourcesTranslated = resources[language];
	const entries = Object.entries(MENU_REFERENCES);
	const menuTranslationsEntries = entries.map((entry: [string, string]) => {
		const [reference, prop] = entry;
		return [resourcesTranslated[prop], reference];
	});
	return Object.fromEntries(menuTranslationsEntries);
};

export const addMenuItemsDataSelectors = (
	menuItems: NodeListOf<HTMLElement>,
	translations: Record<string, string>
): void => {
	menuItems.forEach((menuItem: HTMLElement): void => {
		if (
			menuItem &&
			menuItem.dataset &&
			!menuItem.dataset.selector
		) {
			const icon = menuItem.shadowRoot.querySelector<HTMLElement>(ELEMENT.MENU_ITEM_ICON);
			menuItem.dataset.selector = translations[icon.title];
		}
	});
};

export const parseVersion = (version: string | undefined): Version | null => {
	const versionRegExp = /^(\d+)\.(\d+)\.(\w+)(?:\.(\w+))?$/;
	const match = version
		? version.match(versionRegExp)
		: null;
	if (match) {
		return [
			+match[1],
			+match[2],
			match[3]
		];
	}
	return null;
};