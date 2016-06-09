/// <reference path="../../../typings/main/index.d.ts"/>

import * as path from 'path';
// const webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var copyWebpackPlugin = require('copy-webpack-plugin');
// const dedupePlugin = require('webpack/lib/optimize/dedupePlugin');

// const helpers = require('./helpers');

const METADATA = {
    title: 'datavis',
    baseUrl: '/'
};

module.exports = {
    cache: true,

    metadata: METADATA,

    entry: {
        vendor: [
            //    polyfills needed if core.js not referenced separately 
            //    (also add "core-js": "^2.3.0" to package.json):
            //    'core-js/es6/array',
            //    'core-js/es6/map',
            //    'core-js/es6/string',
            //    'core-js/es6/symbol',
            //    'core-js/es7/reflect',

            //    if we want to go with the angular2 provided zone + reflect-metadata
            //    'angular2/bundles/angular2-polyfills',
            'd3-cloud',
            'ng2-material',
            'flickicity',
            '@angular2-material/core',
            '@angular2-material/checkbox',
            '@angular2-material/grid-list',
            '@angular2-material/card',
            '@angular2-material/input',
            '@angular2-material/radio',
            '@angular2-material/toolbar',

            'zone.js/dist/zone',
            './src/vendor'
        ],
        app: [
            './src/main'
        ]
    },

    output: {
        filename: '[name].js',
        path: path.resolve('./dist/wwwroot'),
        publicPath: '/'
    },

    resolve: {
        extensions: ['', '.js', '.ts'],
        modulesDirectories: ['node_modules'],
        root: path.resolve('./src'),

        alias: {
            'eventEmitter/EventEmitter': 'wolfy87-eventemitter/EventEmitter',
            'get-style-property': 'desandro-get-style-property',
            'matches-selector': 'desandro-matches-selector',
            'classie': 'desandro-classie'
        }
    },

    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: 'tslint',
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                exclude: [/\.spec\.ts$/, 'node_modules'],
                loader: 'ts'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'raw!sass'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|otf)/,
                loader: 'url'
            }
        ],

        noParse: [/zone\.js\/dist\/.+/]
    },

    ts: {
        transpileOnly: true
    },

    tslint: {
        emitErrors: true,
        failOnHint: true,
        resourcePath: 'src',
        rulesDirectory: 'node_modules/codelyzer'
    },

    plugins: [
        new htmlWebpackPlugin({
            title: 'datavis',
            chunksSortMode: 'none',
            filename: 'index.html',
            cache: true,
            hash: false,
            inject: 'body',
            template: './src/index.html',
            minify: {
                removeComments: false,
                collapseWhitespace: false
            }
        }),
        new copyWebpackPlugin([
            // Copy directory contents to {output}/to/directory/ 
            { from: 'node_modules/ng2-material/ng2-material.css',
                to: 'node_modules/ng2-material/' },
            { from: 'node_modules/animate.css/animate.css',
                to: 'node_modules/animate.css/' },
            { from: 'node_modules/flickity/dist/flickity.css',
                to: 'node_modules/flickity/dist' },
            { from: 'node_modules/flickity/dist/flickity.pkgd.js',
                to: 'node_modules/flickity/dist' }
        ])
    ]
};
