const tseslint = require('typescript-eslint');
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
	{
		languageOptions: {
			globals: {
				Atomics: 'readonly',
				SharedArrayBuffer: 'readonly',
				...globals.browser,
				...globals.node,
				...globals.es2015
			}
		}
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
			indent: ['error', 'tab'],
			semi: ['error', 'always'],
			'no-trailing-spaces': ['error'],
			'@typescript-eslint/no-duplicate-enum-values': 'off',
			'@typescript-eslint/no-var-requires': 'off'
		}
	}
];