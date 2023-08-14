const bs = require('browser-sync');
module.exports = function bs_html() {
	bs.init({
		server: {
			baseDir: 'build/',
		},
		port: 3000,
	})
}