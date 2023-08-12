const bs = require('browser-sync');
module.exports = function bs_html() {
	bs.init({
		watch: true,
		server: {
			baseDir: 'build/',
			host: '192.168.0.104',
		},
		ui: {
			port: 8080,
			weinre: {
				port: 9090
			}
		},
		browser: 'default',
		logLevel: 'silent',
		online: false,
		notify: false,
		mime: false,
		scrollRestoreTechnique: 'cookie',
	})
}