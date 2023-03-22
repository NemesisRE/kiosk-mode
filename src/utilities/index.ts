import { StyleElement } from '@types';
import { STYLES_PREFIX, TRUE } from '@constants';

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