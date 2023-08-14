const { src, dest } = require('gulp');
const webpConv = require('gulp-webp');

module.exports = function webp() {
	return src('build/img/**/*-bg*.+(png|jpg|jpeg)')
		.pipe(webpConv())
		.pipe(dest('build/img'))
}