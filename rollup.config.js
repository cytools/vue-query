/**
 * External dependencies.
 */
import * as path from 'path';
import typescript from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import ttypescript from 'ttypescript';

/**
 * Internal dependencies.
 */
import { version } from './package.json';

const builds = {
    'cjs-dev': {
        outFile: 'vue-query.common.js',
        format: 'cjs',
        mode: 'development',
    },
    'cjs-prod': {
        outFile: 'vue-query.common.prod.js',
        format: 'cjs',
        mode: 'production',
    },
    'umd-dev': {
        outFile: 'vue-query.js',
        format: 'umd',
        mode: 'development',
    },
    'umd-prod': {
        outFile: 'vue-query.prod.js',
        format: 'umd',
        mode: 'production',
    },
    esm: {
        outFile: 'vue-query.esm.js',
        format: 'es',
        mode: 'development',
    },
};

function getAllBuilds() {
    return Object.keys(builds).map((key) => genConfig(builds[key]));
}

function genConfig({ outFile, format, mode }) {
    const isProd = mode === 'production';
    return {
        input: './src/index.ts',
        output: {
            file: path.join('./dist', outFile),
            format: format,
            exports: 'named',
            name: format === 'umd' ? 'VueQuery' : undefined,
        },
        plugins: [
            alias({
                resolve: ['.ts'],
                entries: { '@/': path.resolve(__dirname, 'src/') },
            }),
            typescript({
                typescript: ttypescript,
                useTsconfigDeclarationDir: true,
            }),
            resolve({
                // pass custom options to the resolve plugin
                customResolveOptions: {
                    moduleDirectories: ['node_modules'],
                },
            }),
            replace({
                'process.env.NODE_ENV':
                    format === 'es'
                        ? 'process.env.NODE_ENV' // preserve to be handled by bundlers
                        : JSON.stringify(isProd ? 'production' : 'development'),  // hard coded dev/prod builds
                __DEV__:
                    format === 'es'
                        ? `(process.env.NODE_ENV !== 'production')` // preserve to be handled by bundlers
                        : !isProd, // hard coded dev/prod builds
                __VERSION__: JSON.stringify(version),
            }),
            isProd && terser(),
        ].filter(Boolean),
        external: ['lodash'],
    };
}

let buildConfig;

if (process.env.TARGET) {
    buildConfig = [genConfig(builds[process.env.TARGET])];
} else {
    buildConfig = getAllBuilds();
}

// bundle typings
buildConfig.push({
    input: 'typings/index.d.ts',
    output: {
        file: 'dist/index.d.ts',
        format: 'es',
    },
    plugins: [dts()],
});

export default buildConfig;
