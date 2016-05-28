var webpack = require('webpack');
var config = require('./');
const definePlugin = require('webpack/lib/definePlugin');

config.watch = false;
config.output.filename = '[name].[chunkhash:8].js';
config.output.pathinfo = true;
config.devtool = 'eval';

// config.module.loaders.push({
//   test: /\.html$/,
//   loader: 'html-loader'
// });

// config.htmlLoader = {
//   minimize: true,
//   removeAttributeQuotes: false,
//   caseSensitive: true,
//   customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
//   customAttrAssign: [ /\)?\]?=/ ]
// };

config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize
        .CommonsChunkPlugin({
            name: 'vendor',
            filename: '[name].[chunkhash:8].js',
            minChunks: Infinity
        }),
    new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: { screw_ie8: true },
        compress: { screw_ie8: true },
        comments: false,
    }),
    new definePlugin({
        'process.env': {
            'API_URL_PREFIX': ''
        }
    })
);

module.exports = config;
