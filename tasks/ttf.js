const { src, dest } = require('gulp');
const fonter = require('gulp-fonter');

module.exports = function ttf(done) {
  src('build/fonts/**/*.ttf')
    .pipe(fonter({
      formats: ['woff', 'eot']
    }))
    .pipe(dest('build/fonts'));
  done();
}