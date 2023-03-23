import { getCSSString } from '@utilities';
import packageJson from '../package.json';

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
                content: `%cversion ${packageJson.version}`
            }
        ];
    }

    private lines: Line[];

    public log() {
        const contents: string[] = [];
        const styles: string[] = [];
        const lastIndex = this.lines.length - 1;
        const commonStyles = {
            'display'      : 'inline-block',
            'font-size'    : '12px',
            'border-style' : 'solid',
            'border-color' : '#424242',
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
                        ? '5px 0 5px 5px'
                        : '7px 0 7px 10px',
                    'border-width' : borderWidthStart,
                })
            );

            styles.push(
                getCSSString({
                    ...commonStyles,
                    'background'   : line.background || 'white',
                    'color'        : line.color || 'white',
                    'padding'      : index === 0
                        ? '5px'
                        : '7px 5px 7px 0px',
                    'border-width' : borderWidthEnd,
                })
            );

            if (index !== lastIndex) styles.push('');

        });

        console.info(contents.join(''), ...styles);

    }

}