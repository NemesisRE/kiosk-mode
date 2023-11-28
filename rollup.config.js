import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default [
	{
		plugins: [
			json(),
			ts({
				browserslist: false
			}),
			terser({
				output: {
					comments: false
				}
			})
		],
		input: 'src/kiosk-mode.ts',
		output: [
			{
				file: 'dist/kiosk-mode.js',
				format: 'iife'
			},
			{
				file: '.hass/config/www/kiosk-mode.js',
				format: 'iife'
			}
		]
	}
];