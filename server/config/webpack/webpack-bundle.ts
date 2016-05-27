var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');

var config = require('./');

config.watch = false;
config.output.filename = '[name].[chunkhash:8].js';
config.devtool = 'hidden-source-map';
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
        comments: false
    })
);

module.exports = config;
