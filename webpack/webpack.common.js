const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
    entry: {
        popup: path.join(srcDir, 'popup.tsx'),
        options: path.join(srcDir, 'options.tsx'),
        background: path.join(srcDir, 'background.ts'),
        content_script: path.join(srcDir, 'content-script.ts'),
        my_mark_list: path.join(srcDir, 'my-mark-list.tsx'),
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js',
    },
    // optimization: {
    //     splitChunks: {
    //         name: 'vendor',
    //         chunks(chunk) {
    //             return chunk.name !== 'background';
    //         },
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [{ loader: 'text-loader' }],
            },
            {
                test: /\.styl$/,
                use: [
                    { loader: 'text-loader' },
                    { loader: 'stylus-loader' },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@': path.resolve(__dirname, '../src/'),
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './public', to: '../' },
                { from: './src/css/', to: '../css' },
            ],
        }),
    ],
    experiments: {
        topLevelAwait: true,
    },
};
