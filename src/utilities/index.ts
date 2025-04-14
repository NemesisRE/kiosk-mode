import { getPromisableResult } from 'get-promisable-result';
import { HomeAsssistantExtended, Version } from '@types';
import {
	TRUE,
	MENU_REFERENCES,
	MENU_REFERENCES_LEGACY,
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

const getHAResources = (
	ha: HomeAsssistantExtended,
	isLegacyHomeAssistant: boolean
): Promise<Record<string, Record<string, string>>> => {

	const referencePaths = Object.values(
		isLegacyHomeAssistant
			? MENU_REFERENCES_LEGACY
			: MENU_REFERENCES
	);

	return getPromisableResult(
		() => ha?.hass?.resources,
		(resources: Record<string, Record<string, string>>): boolean => {
			const language = ha.hass.language;
			const anyEmptyResource = referencePaths.find((path: string) => {
				return !resources?.[language][path];
			});
			if (!anyEmptyResource) {
				return true;
			}
			return false;
		},
		{
			retries: MAX_ATTEMPTS,
			delay: RETRY_DELAY
		}
	);
};

export const getMenuTranslations = async(
	ha: HomeAsssistantExtended,
	isLegacyHomeAssistant: boolean
): Promise<Record<string, string>> => {
	const resources = await getHAResources(ha, isLegacyHomeAssistant);
	const language = ha.hass.language;
	const resourcesTranslated = resources[language];

	const entries = Object.entries(
		isLegacyHomeAssistant
			? MENU_REFERENCES_LEGACY
			: MENU_REFERENCES
	);
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