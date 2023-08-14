const { src, dest } = require('gulp');
const bs = require('browser-sync');
import image from 'gulp-image';

module.exports = async function rastr() {
	return src('build/img/**/*.+(png|jpg|jpeg|gif|svg|ico|mp4|mp3)')
		.pipe(image({
			pngquant: true,
			optipng: false,
			zopflipng: true,
			jpegRecompress: false,
			mozjpeg: true,
			gifsicle: true,
			svgo: true,
			concurrent: 10,
			quiet: true
		}))
		.pipe(dest('build/img'))
		.pipe(bs.stream())
}