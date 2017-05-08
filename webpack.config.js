var path = require('path')

module.exports = {
	entry: './dist/client/client.js',
	output: {
		path: path.join(__dirname, 'static', 'js'),
		filename: 'bundle.js',
		publicPath: '/static/js/'
	}
}
