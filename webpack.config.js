var path = require('path')

module.exports = {
	entry: './dist/client/client.js',
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'bundle.js',
		publicPath: '/static/'
	}
}
