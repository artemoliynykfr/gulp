const { src, dest } = require('gulp');
const fs = require('fs').promises;
const changed = require('gulp-changed');
const gulpFont = require('gulp-font');
const srcFonts = 'src/scss/fonts.scss';
const appFonts = 'build/fonts/';
const validFontExtensions = ['woff', 'woff2', 'otf'];

module.exports = async function fonts(done) {
  try {
    await fs.writeFile(srcFonts, '');

    const items = await fs.readdir(appFonts);
    let c_fontname;

    for (const item of items) {
      const [fontname, fontExt] = item.split('.');
      if (validFontExtensions.includes(fontExt) && c_fontname !== fontname) {
        await fs.appendFile(srcFonts, `@include font-face("${fontname}", "${fontname}", "${fontweight}");\r\n`);
      }
      c_fontname = fontname;
    }

    const fontSrc = 'src/fonts/**/*.ttf';
    const fontDest = 'build/fonts';

    src(fontSrc)
      .pipe(changed(fontDest, { extension: 'woff', hasChanged: changed.compareLastModifiedTime }))
      .pipe(gulpFont({
        formats: ['woff'],
        dest: fontDest
      }))
      .pipe(dest(fontDest));

    src(fontSrc)
      .pipe(changed(fontDest, { extension: 'woff2', hasChanged: changed.compareLastModifiedTime }))
      .pipe(gulpFont({
        formats: ['woff2'],
        dest: fontDest
      }))
      .pipe(dest(fontDest));

    src(fontSrc)
      .pipe(changed(fontDest, { extension: 'otf', hasChanged: changed.compareLastModifiedTime }))
      .pipe(gulpFont({
        formats: ['otf'],
        dest: fontDest
      }))
      .pipe(dest(fontDest));

    done();
  } catch (error) {
    console.error('Error:', error);
    done(error);
  }
};
