import { KioskConfig } from '@types';
import { NAMESPACE, CONDITIONAL_OPTION } from '@constants';
import { getCSSString } from 'home-assistant-styles-manager';
import { version } from '../package.json';

interface Line {
    content: string;
    color?: string;
    background?: string;
}

const MAX_LENGTH = 27;
const LINES: Line[] = [
	{
		content: '%c≡ kiosk-mode',
		color: 'white',
		background: '#03a9f4'
	},
	{
		content: `%cversion ${version}`
	}
];

const CONSOLE_STYLES = {
	NORMAL: 'font-weight: normal; color: inherit;',
	BLUE: 'font-weight: bold; color: blue;',
	RED: 'font-weight: bold; color: red;',
	GREEN: 'font-weight: bold; color: green;',
	CODE: 'color: #666',
	UNDERLINE: 'text-decoration: underline'
};

const CONDITIONAL_OPTION_VALUES = Object.values(CONDITIONAL_OPTION);

export class ConsoleMessenger {

	public static logInfo() {
		const contents: string[] = [];
		const styles: string[] = [];
		const lastIndex = LINES.length - 1;
		const commonStyles = {
			'border-color' : '#424242',
			'border-style' : 'solid',
			'display'      : 'inline-block',
			'font-family'  : 'monospace',
			'font-size'    : '12px'
		};

		LINES.forEach((line: Line, index: number): void => {

			// contents
			contents.push(line.content.padEnd(MAX_LENGTH));
			contents.push('%c⋮');

			if (index !== lastIndex) contents.push('%c\n');

			// styles
			let borderWidthStart = '0 0 0 1px';
			let borderWidthEnd = '0 1px 0 1px';

			if (index === 0) {
				borderWidthStart = '1px 0 0 1px';
				borderWidthEnd = '1px 1px 0 0';
			} else if (index === lastIndex) {
				borderWidthStart = '0 0 1px 1px';
				borderWidthEnd = '0 1px 1px 0';
			}

			styles.push(
				getCSSString({
					...commonStyles,
					'background'   : line.background || 'white',
					'color'        : line.color || '#424242',
					'padding'      : index === 0
						? '1px 0px 1px 5px'
						: '1px 0px 1px 10px',
					'border-width' : borderWidthStart,
				})
			);

			styles.push(
				getCSSString({
					...commonStyles,
					'background'   : line.background || 'white',
					'color'        : line.color || 'white',
					'padding'      : index === 0
						? '1px 5px'
						: '1px 5px 1px 0px',
					'border-width' : borderWidthEnd,
				})
			);

			if (index !== lastIndex) styles.push('');

		});

		console.info(contents.join(''), ...styles);

	}

	public static debugRawConfig(config: KioskConfig, panel: string): void {
		console.groupCollapsed(`${NAMESPACE} raw config for ${panel} panel`);
		console.table(config);
		console.groupEnd();
	}

	public static debugFinalConfig(config: KioskConfig, panel: string): void {
		const entries = Object.entries(config);
		const filteredConfig = entries.filter(([prop]) => !(prop in CONDITIONAL_OPTION_VALUES));
		console.groupCollapsed(`${NAMESPACE} final config for ${panel} panel`);
		console.table(
			Object.fromEntries(filteredConfig)
		);
		console.groupEnd();
	}

	public static debug(option: string, code: string, result: unknown): void {
		console.groupCollapsed(`${NAMESPACE} debug`);
		console.info(
			`Template rendering triggered for option %c${option}%c with the next template:`,
			CONSOLE_STYLES.BLUE,
			CONSOLE_STYLES.NORMAL
		);
		console.info(
			`%c${code}`,
			CONSOLE_STYLES.CODE
		);
		console.info(
			`The evaluation of this template is: %c${result}`,
			typeof result === 'boolean'
				? CONSOLE_STYLES.GREEN
				: CONSOLE_STYLES.RED
		);
		if (typeof result !== 'boolean') {
			console.warn(
				'%c⚠️ As this template didn\'t return a boolean, this option has been set to false',
				CONSOLE_STYLES.UNDERLINE
			);
		}
		console.groupEnd();
	}

	public static debugTemplate(code: string, result: unknown): void {
		console.group(`${NAMESPACE} template debug`);
		console.info(`The template debug has been triggered with the next template:`);
		console.info(
			`%c${code}`,
			CONSOLE_STYLES.CODE
		);
		console.info(
			`The evaluation of this template is: %c${result}`,
			typeof result === 'boolean'
				? CONSOLE_STYLES.GREEN
				: CONSOLE_STYLES.RED
		);
		if (typeof result !== 'boolean') {
			console.warn(
				'%c⚠️ This template doesn\'t return a boolean. It cannot be used as a kiosk-mode option.',
				CONSOLE_STYLES.UNDERLINE
			);
		}
		console.groupEnd();
	}

}