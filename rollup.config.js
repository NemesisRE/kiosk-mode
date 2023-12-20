import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';

export default [
	{
		plugins: [
			nodeResolve(),
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
		output: {
			file: 'dist/kiosk-mode.js',
			format: 'iife'
		}
	},
	{
		plugins: [
			nodeResolve(),
			json(),
			ts({
				browserslist: false
			}),
			istanbul({
				exclude: [
					'node_modules/**/*',
					'package.json'
				]
			})
		],
		input: 'src/kiosk-mode.ts',
		output: {
			file: '.hass/config/www/kiosk-mode.js',
			format: 'iife'
		}
	}
];