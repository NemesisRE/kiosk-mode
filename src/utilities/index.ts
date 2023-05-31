import {
    HomeAssistant,
    StyleElement,
    Version
} from '@types';
import {
    STYLES_PREFIX,
    TRUE,
    MENU_REFERENCES,
    MAX_ATTEMPTS,
    RETRY_DELAY
} from '@constants';

// Convert to array
export const toArray = <T>(x: T | T[]): T[] => {
    return Array.isArray(x) ? x : [x];
};

const getElementName = (elem: HTMLElement | ShadowRoot): string => {
    if (elem instanceof ShadowRoot) {
        return elem.host.localName;
    }
    return elem.localName;
};

export const styleExists = (elem: HTMLElement | ShadowRoot): HTMLStyleElement => {
    const name = getElementName(elem);
    return elem.querySelector<HTMLStyleElement>(`#${STYLES_PREFIX}_${name}`);
};

export const addStyle = (css: string, elem: HTMLElement | ShadowRoot): void => {
    const name = getElementName(elem);
    let style = styleExists(elem);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute('id', `${STYLES_PREFIX}_${name}`);
        elem.appendChild(style);
    }
    style.innerHTML = css;
};

export const removeStyle = (elements: StyleElement): void => {
    toArray(elements).forEach((elem) => {
        const name = getElementName(elem);
        if (styleExists(elem)) {
            elem.querySelector(`#${STYLES_PREFIX}_${name}`).remove();
        }
    });
};

// Return true if keyword is found in query strings.
export const queryString = (keywords: string | string[]): boolean => {
    return toArray(keywords).some((x) => window.location.search.includes(x));
};

// Set localStorage item.
export const setCache = (k: string | string[], v: string): void => {
    toArray(k).forEach((x) => window.localStorage.setItem(x, v));
};

// Retrieve localStorage item as bool.
export const cached = (key: string | string[]): boolean => {
    return toArray(key).some((x) => window.localStorage.getItem(x) === TRUE);
};

// Convert a CSS in JS to string
export const getCSSString = (cssInJs: Record<string, string>): string => {
    return Object.entries(cssInJs)
        .map((entry: [string, string]): string => {
            const [decl, value] = entry;
            return `${decl}:${value}`;
        })
        .join(';') + ';';
};

// Convert a CSS rules object to string
export const getCSSRulesString = (cssRulesInJs: Record<string, Record<string, string>>): string => {
    return Object.entries(cssRulesInJs)
        .map((entry: [string, Record<string, string>]): string => {
            const [rule, cssInJs] = entry;
            return `${rule}{${getCSSString(cssInJs)}}`;
        }).join('');
};

export const getDisplayNoneRulesString = (...rules: string[]): string => {
    return rules.map((rule: string): string => {
        return `${rule}{display: none !important;}`;
    }).join('');
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
}

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

export const isLegacyVersion = (version: string | undefined): boolean => {
    const parsedVersion = parseVersion(version);
    if (parsedVersion) {
        return parsedVersion[0] <= 2023 && parsedVersion[1] <= 3;
    }
    return false;
};

export const getMenuItems = (getElements: () => NodeListOf<HTMLElement>): Promise<NodeListOf<HTMLElement>> => {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const select = () => {
            const items = getElements();
            if (items && items.length) {
                resolve(items);
            } else {
                attempts++;
                if (attempts < MAX_ATTEMPTS) {
                    setTimeout(select, RETRY_DELAY);
                } else {
                    reject();
                }
            }
        };
        select();
    });
};