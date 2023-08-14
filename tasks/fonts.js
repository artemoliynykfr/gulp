const { src } = require('gulp');
const fs = require('fs');
const through2 = require('through2');

module.exports = function fonts(done) {
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
