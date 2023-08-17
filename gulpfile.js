/* version 1.0 */
/* 
  import all dependecies
  don't use require(), because it's module type document
  if plugin don't support import, find another
*/
import gulp from 'gulp';
const { src, dest, parallel, watch } = gulp;
import bs from 'browser-sync';
import fs from 'fs';
import include from 'gulp-file-include';
import through2 from 'through2';
import concat from 'gulp-concat';
import minifyjs from 'gulp-js-minify';
import image from 'gulp-image';
import dartSass from 'gulp-dart-sass';
import mqpacker from 'css-mqpacker';
import MediaQueryNesting from 'media-query-nesting';
import bulk from "gulp-sass-bulk-importer";
import prefixer from "gulp-autoprefixer";
import clean from "gulp-clean-css";
import fonter from 'gulp-fonter';
import webpConv from 'gulp-webp';
/* local server */
function browsersync() {
  bs.init({
    server: {
      baseDir: 'build/',
    },
    port: 3000,
  })
}
/* generate styles for fonts */
function fonts(done) {
  let fontsCss = '';
  let fontWeight;
  let fontStyle;
  return src('build/fonts/*.{woff,woff2}')
    .pipe(through2.obj((file, enc, cb) => {
      const fontName = file.stem;
      /* 
        make fonts.css more automatic - give styles by fontName
        it's quite big code, maybe I'll optimize it
      */
      const fontThin = fontName.includes('Thin', "thin")
      const fontBook = fontName.includes('Book', "book", "ExtraL", "extral", "Extral")
      const fontRegular = fontName.includes('Regular', "regular", "Normal", "normal")
      const fontBold = fontName.includes('Bold', "bold")
      const fontMedium = fontName.includes('Medium', "medium")
      const fontLight = fontName.includes('Light', "light")
      const fontSemiBold = fontName.includes('Semibold', "semibold", 'SemiBold', "semiBold", "semibold")
      const fontExBold = fontName.includes('ExtraB', "Extrab", "extraB", "extrab")
      const fontBlack = fontName.includes('Black', "black", "heavy", "Heavy")
      const fontItalic = fontName.includes('Italic', "italic")
      fontWeight = "normal"
      fontStyle = "normal"
      if (fontItalic) {
        fontStyle = "italic"
      }
      if (fontThin) {
        fontWeight = 100
      }
      if (fontBook) {
        fontWeight = 200
      }
      if (fontLight) {
        fontWeight = 300
      }
      if (fontRegular) {
        fontWeight = 400
      }
      if (fontMedium) {
        fontWeight = 500
      }
      if (fontSemiBold) {
        fontWeight = 600
      }
      if (fontBold) {
        fontWeight = 700
      }
      if (fontExBold) {
        fontWeight = 800
      }
      if (fontBlack) {
        fontWeight = 900
      }
      /* generate style for font */
      fontsCss +=
        `/* ${fontName} */
@font-face {
  font-family: '${fontName.split('-')[0]}', sans-serif;
  font-style: ${fontStyle};
  font-weight: ${fontWeight};
  font-display: block;
  src: url(${fontName}.eot);
  src: url(${fontName}.eot) format("embedded-opentype"), url(${fontName}.woff) format("woff"), url(${fontName}.ttf) format("truetype");
}

`;
      cb(null, file);
    }))
    /* return style to fonts.css */
    .on('end', () => {
      fs.writeFileSync('build/css/fonts.css', fontsCss);
    });
};
/* compile html */
function html() {
  return src(['src/**/*.html', '!src/components/**/*.html'])
    .pipe(include())
    .pipe(dest('build'))
    .pipe(bs.stream())
}
/* compile js (min and not win version) */
function js() {
  return src('src/js/script.js')
    .pipe(concat('script.min.js'))
    .pipe(minifyjs())
    .pipe(gulp.dest('build/js/'))
    .pipe(bs.stream());
}
/* compile images and change quility */
function rastr() {
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
/* compiles scss, create min and not min version, create media.css file */
function style() {
  const isMinified = true;
  const stylesDefault = src('src/scss/**/*.scss')
    .pipe(bulk())
    .pipe(
      dartSass({
        outputStyle: isMinified ? 'compressed' : 'expanded',
      }).on('error', dartSass.logError)
    )
    .pipe(
      prefixer({
        overrideBrowserslist: ['last 8 versions'],
        browsers: [
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24',
          'Explorer >= 11',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6',
        ],
      })
    )
    .pipe(
      clean({
        level: 2,
      })
    )
    .pipe(concat(isMinified ? 'style.min.css' : 'style.css'))
    .pipe(dest('build/css/'))
    .pipe(bs.stream());

  const mediaQueryPipeline = src('src/scss/**/*.scss')
    .pipe(mediaQueryNesting.extract())
    .pipe(mediaQueryNesting.group())
    .pipe(mediaQueryNesting.combine())
    .pipe(mqpacker())
    .pipe(concat('media.css'))
    .pipe(dest('build/css/'));
  return merge(stylesDefault, mediaQueryPipeline);
};
/* generate and convert fonts */
function ttf(done) {
  src('build/fonts/**/*.ttf')
    .pipe(fonter({
      formats: ['woff', 'eot']
    }))
    .pipe(dest('build/fonts'));
  done();
}
/* watch chenges and reload */
function watching() {
  watch('src/**/*.html', parallel('htmlRun'));
  watch('src/**/*.scss', parallel('styleRun'));
  watch('src/**/*.js', parallel('jsRun'));
  watch('src/**/*.json', parallel('htmlRun'));
}
/* convert to webp */
function webp() {
  return src('build/img/**/*-bg*.+(png|jpg|jpeg)')
    .pipe(webpConv())
    .pipe(dest('build/img'))
}
/* create tasks from functions */
export const browsersyncRun = browsersync;
export const htmlRun = html;
export const styleRun = style;
export const jsRun = js;
export const watchingRun = watching;
export const rastrRun = rastr;
export const webpRun = webp;
export const ttfRun = ttf;
export const fontsRun = fonts;
/* default task for gulp */
gulp.task('default', parallel(browsersyncRun, htmlRun, styleRun, jsRun, watchingRun));
/* run not with default, because it slow down main thread */
/* task for images - compile images and change quility, convert to webp*/
gulp.task('images', parallel(rastrRun, webpRun));
/* task for images - generate and convert fonts, generate styles for fonts */
gulp.task('fonts', parallel(ttfRun, fontsRun));