const {
	src,
	dest
} = require('gulp');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const bs = require('browser-sync');
const plumber = require('gulp-plumber');

module.exports = function rastr() {
	return src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico|mp4|mp3)')
		.pipe(plumber())
		.pipe(changed('build/img'))
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 85, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: true }
				]
			})
		]))
		.pipe(dest('build/img'))
		.pipe(bs.stream())
}