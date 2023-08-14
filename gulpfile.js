import gulp from 'gulp';
const { src, dest, parallel } = gulp;
import bs from 'browser-sync';
import fs from 'fs';
import include from 'gulp-file-include';
import through2 from 'through2';
import uglify from 'gulp-uglify-es';
import concat from 'gulp-concat';
import image from 'gulp-image';
import sass from "gulp-sass";
import bulk from "gulp-sass-bulk-importer";
import prefixer from "gulp-autoprefixer";
import clean from "gulp-clean-css";
import fonter from 'gulp-fonter';
import webpConv from 'gulp-webp';
function browsersync() {
  bs.init({
    server: {
      baseDir: 'build/',
    },
    port: 3000,
  })
}
function fonts(done) {
  let fontsCss = '';
  let fontWeight;
  let fontStyle;
  return src('build/fonts/*.{woff,woff2}')
    .pipe(through2.obj((file, enc, cb) => {
      const fontName = file.stem;
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
    .on('end', () => {
      fs.writeFileSync('build/css/fonts.css', fontsCss);
    });
};
function html() {
  return src(['src/**/*.html', '!src/components/**/*.html'])
    .pipe(include())
    .pipe(dest('build'))
    .pipe(bs.stream())
}
function js() {
  return src(['src/components/**/*.js', 'src/js/script.js'])
    .pipe(dest('build/js/'))
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(dest('build/js/'))
    .pipe(bs.stream())
}
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
function style() {
  const minstyle = src("src/scss/**/*.scss")
    .pipe(bulk())
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(
      prefixer({
        overrideBrowserslist: ["last 8 versions"],
        browsers: [
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 11",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6",
        ],
      })
    )
    .pipe(
      clean({
        level: 2,
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(dest("build/css/"))
    .pipe(bs.stream());
  const notminstyle = src("src/scss/**/*.scss")
    .pipe(bulk())
    .pipe(
      sass().on("error", sass.logError)
    )
    .pipe(
      prefixer({
        overrideBrowserslist: ["last 8 versions"],
        browsers: [
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 11",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6",
        ],
      })
    )
    .pipe(concat("style.css"))
    .pipe(dest("build/css/"))
    .pipe(bs.stream());
  return notminstyle, minstyle
};
function ttf(done) {
  src('build/fonts/**/*.ttf')
    .pipe(fonter({
      formats: ['woff', 'eot']
    }))
    .pipe(dest('build/fonts'));
  done();
}
function watching() {
  watch('src/**/*.html', parallel('html'));
  watch('src/**/*.scss', parallel('style'));
  watch('src/**/*.js', parallel('js'));
  watch('src/**/*.json', parallel('html'));
}
function webp() {
  return src('build/img/**/*-bg*.+(png|jpg|jpeg)')
    .pipe(webpConv())
    .pipe(dest('build/img'))
}
export const browsersyncRun = browsersync;
export const htmlRun = html;
export const styleRun = style;
export const jsRun = js;
export const watchingRun = watching;
export const rastrRun = rastr;
export const webpRun = webp;
export const ttfRun = ttf;
export const fontsRun = fonts;
gulp.task('default', parallel(browsersyncRun, htmlRun, styleRun, jsRun, watchingRun));
gulp.task('images', parallel(rastrRun, webpRun));
gulp.task('fonts', parallel(ttfRun, fontsRun));