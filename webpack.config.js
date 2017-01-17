var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	context: __dirname,
	entry: {
	  init: [ './src/init.tsx' ],
	  bundle: ['./src/index.tsx']
	},
		
	output: {
		path: './dist',
		filename: '[name].js',
		publicPath: '/dist/'
	},

	resolve: {
		extensions: ['', 'js', 'ts', '.tsx', '.scss']
	},

	module: {
		loaders: [
			{ test: /\.(tsx|ts)?$/, loader: 'ts-loader' },
			{ test: /\.(scss|css)$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader') },
			{ test: /\.(xml|html|txt|md)$/, loader: 'raw-loader'},
			{ test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i, loader: 'url-loader?limit=10000' }
		]
	},

	postcss: () => [
		require('autoprefixer')
	],

	plugins: ([
		new CopyWebpackPlugin([
			{ from: './src/index.html', to: 'index.html' }
		]),
		new ExtractTextPlugin('style.css', { allChunks: true, }),
		new CompressionPlugin()
	]),

	devtool: 'source-map'
};