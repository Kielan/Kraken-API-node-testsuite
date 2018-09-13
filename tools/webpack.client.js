var path = require('path')
var webpackMerge = require('webpack-merge')
var webpackCommonConfig = require('./webpack.common')
//'@babel/polyfill', './src/main.js'
//here polygill is set, but needs to be overridden
var envEntry = require('./entry')

var entry = {
  'app': envEntry,
  'main': ['./sass/main.scss'],
}
var loaders = webpackCommonConfig.module.rules.concat()

const WebpackRecipe = webpackMerge({
  cache: false,
  devtool: '',
  entry: entry,
  module: {
    loaders: loaders
  },
  output: {
    path: path.join(process.cwd(), 'public'),
    publicPath: '/',
    chunkFilename: 'js/[name].js',
    filename: 'js/[name].js',
  },
  plugins: [],
}, webpackCommonConfig)
module.exports = WebpackRecipe
