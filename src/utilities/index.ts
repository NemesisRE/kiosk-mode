import { HomeAssistant, Version } from '@types';
import { getPromisableResult } from 'get-promisable-result';
import {
	TRUE,
	MENU,
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

export const getMenuTranslations = async(ha: HomeAssistant, version: Version): Promise<Record<string, string>> => {

	const referencePaths = Object.entries(MENU_REFERENCES);

	// This code is needed for Home Assistant versions older than 2025.9.x
	const isLegacy = (
		version[0] < 2025
		|| (
			version[0] === 2025
			&& version[1] < 9
		)
	);
	const finalReferencePaths = isLegacy
		? referencePaths.filter(([, key]) => {
			// This translation doesn't exist in Home Assistant < 2025.9.x
			return MENU_REFERENCES[MENU.ADD] !== key;
		})
		: referencePaths;
	// End of custom code for Home Assistant versions older than 2025.9.x

	const translations = await getPromisableResult(
		() => finalReferencePaths.map((entry): [string, string] => {
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

const getTranslationWithoutShorcutSuffix = (text: string): string => {
	return text
		.trim()
		.replace(RESOURCE_WITH_SUFFIX_REGEXP, '$1')
		.trim();
};

export const addMenuItemsDataSelectors = (
	haIconButtons: NodeListOf<HTMLElement>,
	translations: Record<string, string>
): void => {
	haIconButtons.forEach((haIconButton: HTMLElement): void => {
		if (
			haIconButton &&
			haIconButton.dataset &&
			!haIconButton.dataset.selector
		) {
			const labelledBy = haIconButton.getAttribute('aria-labelledby');
			if (!labelledBy) return;
			const tooltip = haIconButton.parentElement.querySelector<HTMLElement>(`#${labelledBy.trim()}`);
			if (!tooltip) return;
			const translation = getTranslationWithoutShorcutSuffix(tooltip.textContent);
			haIconButton.dataset.selector = translations[translation];
		}
	});
};

export const addHeaderButtonsDataSelectors = (
	headerButtons: NodeListOf<HTMLElement>,
	translations: Record<string, string>
) => {
	headerButtons.forEach((headerButton: HTMLElement): void => {
		const menuItem: HTMLElement | null = headerButton
			.querySelector<HTMLElement>(ELEMENT.MENU_ITEM);
		if (
			menuItem &&
			menuItem.dataset &&
			!menuItem.dataset.selector
		) {
			const icon = menuItem.shadowRoot.querySelector<HTMLElement>(ELEMENT.MENU_ITEM_ICON);
			menuItem.dataset.selector = translations[icon.title.trim()];
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
			menuItem.dataset.selector = translations[icon.title.trim()];
		}
	});
};

export const addOverlayMenuItemsDataSelectors = (
	overflowMenuItems: NodeListOf<HTMLElement>,
	translations: Record<string, string>
) => {
	overflowMenuItems.forEach((overflowMenuItem: HTMLElement): void => {
		if (
			overflowMenuItem &&
			overflowMenuItem.dataset &&
			!overflowMenuItem.dataset.selector
		) {
			const textContent = getTranslationWithoutShorcutSuffix(overflowMenuItem.textContent);
			overflowMenuItem.dataset.selector = translations[textContent];
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