const { watch, parallel } = require('gulp');

module.exports = function watching() {
  watch('src/**/*.html', parallel('html'));
  watch('src/**/*.scss', parallel('style'));
  watch('src/**/*.js', parallel('js'));
  watch('src/**/*.json', parallel('html'));
}