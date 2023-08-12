const { src, dest } = require('gulp');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const bs = require('browser-sync');

module.exports = function dev_js() {
	return src(['src/components/**/*.js', 'src/js/script.js'])
		.pipe(concat('script.js'))
		.pipe(dest('build/js/'))
		.pipe(bs.stream())
		.pipe(uglify())
		.pipe(concat('script.min.js'))
		.pipe(dest('build/js/'))
		.pipe(bs.stream());
};
