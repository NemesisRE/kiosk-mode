import { HomeAssistant, Version } from '@types';
import {
	TRUE,
	MENU_REFERENCES,
	MAX_ATTEMPTS,
	RETRY_DELAY,
	NAMESPACE,
	ELEMENT,
	OPTION
} from '@constants';

// Convert to array
export const toArray = <T>(x: T | T[]): T[] => {
	return Array.isArray(x) ? x : [x];
};

// Get cache key
export const getCacheKey = (option: string): string => {
	const optionCamelCase = option.replace(/(?:^|_)([a-z])/g, (__match: string, letter): string => {
		return letter.toUpperCase();
	});
	return `km${optionCamelCase}`;
};

// Return true if keyword is found in query strings.
export const queryString = (keywords: string | string[]): boolean => {
	const params = new URLSearchParams(window.location.search);
	return toArray(keywords).some((x) => params.has(x));
};

// Set localStorage item.
export const setCache = (options: OPTION | OPTION[], value: string): void => {
	toArray(options)
		.forEach(
			(option) => window.localStorage.setItem(
				getCacheKey(option),
				value
			)
		);
};

// Retrieve localStorage item as bool.
export const cached = (options: OPTION | OPTION[]): boolean => {
	return toArray(options)
		.some((option) => {
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
	const rulesEntries = toArray(rules).map((rule: string): [string, false] => {
		return [rule, false];
	});
	return Object.fromEntries(rulesEntries);
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

export const getPromisableElement = <T>(
	getElement: () => T,
	check: (element: T) => boolean,
	elementName: string
): Promise<T> => {
	return new Promise<T>((resolve, reject) => {
		let attempts = 0;
		const select = () => {
			const element: T = getElement();
			if (element && check(element)) {
				resolve(element);
			} else {
				attempts++;
				if (attempts < MAX_ATTEMPTS) {
					setTimeout(select, RETRY_DELAY);
				} else {
					reject(new Error(`${NAMESPACE}: Cannot select ${elementName} after ${MAX_ATTEMPTS} attempts. Giving up!`));
				}
			}
		};
		select();
	});
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