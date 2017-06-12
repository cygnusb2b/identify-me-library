const webpack = require('webpack');
const { resolve } = require('path');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcDir = resolve(__dirname, 'src');
const serverUrl = 'http://localhost:8000';

module.exports = function(env) {
  const { ifProd, ifNotProd } = getIfUtils(env);
  return {
    cache: ifNotProd(),
    entry: {
      'id-me': [
        'whatwg-fetch',
        './src/index.js',
      ],
    },
    devtool: ifProd('source-map', 'cheap-eval-source-map'),
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      modules: [
        srcDir,
        resolve(__dirname, 'node_modules'),
      ],
    },
    output: {
      filename: ifProd('[name].[chunkhash].js', '[name].js'),
      path: resolve(__dirname, 'dist'),
      publicPath: '/',
      library: 'IdMe',
      libraryTarget: 'umd',
    },
    devServer: {
      port: 3080,
      proxy: {
        '/newsletter': {
          target: serverUrl,
          secure: false,
        },
        '/rest': {
          target: serverUrl,
          secure: false,
        },
        '/component': {
          target: serverUrl,
          secure: false,
        },
      },
    },
    module: {
      rules: removeEmpty([
        {
          test: /\.jsx?$/,
          include: [ srcDir ],
          enforce: 'pre',
          loader: 'eslint-loader',
        },
        {
          test: /\.jsx?$/,
          include: [ srcDir ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'es2015', 'react'],
            },
          },
        },
      ]),
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      }),

      new HtmlWebpackPlugin({
        template: resolve(__dirname, 'src/index.html'),
      }),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: true
      })),

      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        },
        sourceMap: true
      })),

    ]),
  };
};
