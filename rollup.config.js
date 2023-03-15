import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

export default {
    plugins: [
        ts({
            transpileOnly: true,
            browserslist: ["last 2 versions", "not dead", "> 0.2%"]
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
            file: 'kiosk-mode.js',
            format: 'iife'
        }
    ]
};