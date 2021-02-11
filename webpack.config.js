/**
 * External dependencies.
 */
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    watchOptions: {
        ignored: /node_modules/,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.json'),
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    output: {
        filename: `vue-query.min.js`,
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: {
            commonjs: 'vue-query.cjs.js',
        },
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
};
