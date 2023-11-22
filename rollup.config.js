import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import istanbul from 'rollup-plugin-istanbul';

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
            }
        ]
    },
    {
        plugins: [
            json(),
            ts({
                browserslist: false
            }),
            istanbul({
                exclude: [
                    'node_modules/**/*'
                ]
            }),
        ],
        input: 'src/kiosk-mode.ts',
        output: [
            {
                file: '.hass/config/www/kiosk-mode.js',
                format: 'iife'
            }
        ]
    }
];