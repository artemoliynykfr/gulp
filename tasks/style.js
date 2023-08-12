const { src, dest } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const bulk = require("gulp-sass-bulk-importer");
const prefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean-css");
const concat = require("gulp-concat");
const bs = require("browser-sync");

module.exports = function style() {
  const mainStream = src("src/scss/style.scss")
    .pipe(bulk())
    .pipe(sass().on("error", sass.logError))
    .pipe(prefixer({
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
    }))
    .pipe(dest("build/css/"))
    .pipe(bs.stream());

  mainStream.pipe(concat("style.min.css"))
    .pipe(clean({ level: 2 }))
    .pipe(dest("build/css/"))
    .pipe(bs.stream());

  return src("src/scss/**/*.scss") 
    .pipe(bulk())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("media.css"))
    .pipe(dest("build/css/"))
    .pipe(bs.stream());
};
