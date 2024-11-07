import { getCSSString } from 'home-assistant-styles-manager';
import { version } from '../package.json';

interface Line {
    content: string;
    color?: string;
    background?: string;
}

const MAX_LENGTH = 27;

export class ConInfo {

	constructor() {
		this.lines = [
			{
				content: '%c≡ kiosk-mode',
				color: 'white',
				background: '#03a9f4'
			},
			{
				content: `%cversion ${version}`
			}
		];
	}

	private lines: Line[];

	public log() {
		const contents: string[] = [];
		const styles: string[] = [];
		const lastIndex = this.lines.length - 1;
		const commonStyles = {
			'border-color' : '#424242',
			'border-style' : 'solid',
			'display'      : 'inline-block',
			'font-family'  : 'monospace',
			'font-size'    : '12px'
		};

		this.lines.forEach((line: Line, index: number): void => {

			// contents
			contents.push(line.content.padEnd(MAX_LENGTH));
			contents.push('%c⋮');

			if (index !== lastIndex) contents.push('%c\n');

			// styles
			let borderWidthStart = '0 0 0 1px';
			let borderWidthEnd = '0 1px 0 1px';

			if (lastIndex === 0) {
				borderWidthStart = '1px 0 1px 1px';
				borderWidthEnd = '1px 1px 1px 0';
			} else if (index === 0) {
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

}