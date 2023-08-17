# kiforks/media-query-nesting
The rule due to which only style properties can be inside the media query

## Installation

```bash
npm install kiforks/media-query-nesting --save-dev
```

## Usage

If your project does not already have stylelint, then in the root of the project create the file `.stylelintrc`, or with the extension `.stylelintrc.js` so that the code editor can highlight the syntax.

Then add `kiforks/media-query-nesting` to the `.stylelintrc` config file.

_.stylelintrc_
```json
{
    "plugins": [
      "kiforks/media-query-nesting"
    ],
    "rules": {
	    "kiforks/media-query-nesting": true
    }
}
```

**ATTENTION!** This config is for media [mixins](https://gist.github.com/kifork/0c449aace117fb4db7695aea34b63925) instead of **media queries**:
```scss
/* BAD */
@include media-min(xs) {
  .block {
	  width: 300px;
  }
}

/* GOOD */
.block {
	@include media-min(xs) {
		width: 300px;
    }
}
```
