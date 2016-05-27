var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');

var config = require('./config/webpack');

export default (PORT) => {
    config.devtool = 'inline-source-map';

    // config.entry.app.unshift(`webpack-dev-server/client?http://localhost:${PORT}/`);

    config.plugins.push(
        new webpack
            .optimize
            .CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity })
    );

    const frontServer = new webpackDevServer(webpack(config), {
        proxy: {
            '/api/*': {
                target: {
                    'host': 'action-js.dev',
                    'protocol': 'http',
                    'port': (PORT - 1)
                },
                secure: false,
                ignorePath: true,
                changeOrigin: true
            }
        },
        quiet: false,
        noInfo: false,
        contentBase: './src',
        historyApiFallback: true,
        inline: true,
        watchOptions: {
            aggregateTimeout: 250
        },
        stats: {
            assets: true,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false
        },
        publicPath: '/',
        outputPath: './wwwroot'
    });

    frontServer.listen(PORT, 'localhost');
}


