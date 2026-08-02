import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import globals from 'globals';

export default [
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
	},
	{
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off'
		}
	}
];