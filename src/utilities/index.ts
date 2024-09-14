import {
	HomeAsssistantExtended,
	ButtonItemTooltip,
	Version
} from '@types';
import { getPromisableResult } from 'get-promisable-result';
import {
	TRUE,
	MENU_REFERENCES,
	ELEMENT,
	OPTION,
	MAX_ATTEMPTS,
	RETRY_DELAY,
	RESOURCE_WITH_SUFFIX_REGEXP
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

export const getMenuTranslations = async(ha: HomeAsssistantExtended): Promise<Record<string, string>> => {

	const referencePaths = Object.entries(MENU_REFERENCES);

	const translations = await getPromisableResult(
		() => referencePaths.map((entry): [string, string] => {
			const [key, translationPath] = entry;
			return [ha.hass.localize(translationPath), key];
		}),
		(translationEntries: [string, string][]): boolean => {
			return !translationEntries.find((entry) => !entry[0]);
		},
		{
			retries: MAX_ATTEMPTS,
			delay: RETRY_DELAY
		}
	);

	return Object.fromEntries(translations);
};

export const addMenuItemsDataSelectors = (
	buttonItemsTooltips: NodeListOf<ButtonItemTooltip>,
	translations: Record<string, string>
): void => {
	buttonItemsTooltips.forEach((buttonItemTooltip: ButtonItemTooltip): void => {
		if (
			buttonItemTooltip &&
			buttonItemTooltip.dataset &&
			!buttonItemTooltip.dataset.selector
		) {
			const translation = buttonItemTooltip
				.content
				.replace(RESOURCE_WITH_SUFFIX_REGEXP, '$1');
			buttonItemTooltip.dataset.selector = translations[translation];
		}
	});
};

export const addDialogsMenuItemsDataSelectors = (
	menuItems: NodeListOf<HTMLElement>,
	translations: Record<string, string>
) => {
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