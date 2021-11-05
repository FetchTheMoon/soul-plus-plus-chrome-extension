const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    mangle: false,
                    compress: true,
                    keep_fnames: true,
                    keep_classnames: true,
                    format: {
                        beautify: false,
                        comments: false,
                    },
                },
            }),
        ],
    },
});