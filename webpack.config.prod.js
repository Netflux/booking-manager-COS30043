var path = require('path')
var webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
	entry: './dist/client/client.js',
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
}
