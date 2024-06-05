# Glyph Viewer

A website viewing tool for all the glyphs in a font file. It uses a json file with glyph unicodes to read all the glyphs and create a grid on the page. Javascript is used to convert the unicode to readable glyphs and showing a larger version of the glyph on tap/click/hover.

It works on smaller viewports too, but there the chosen glyph opens up inline in the grid. On wide viewports it appears beside the grid.

## Requirements

A json file with unicodes divided into categories (uppercase, lowercase, figures, etc.).

```
	{
		"category": "Symbol", 
		"chars": ["0040", "0026", "00A9", "00AE", "2122", "007C"]
	}, 
```

I extracted mine from Glyphs App with some Python. Link will follow to the repository with that code.

## Use

### The files you will need:
- `assets/css/glyph-viewer.css`
- `assets/js/glyphs.json`
- `assets/js/glyph-viewer.js`
 

### HTML
- From the index.html file copy `<main class="module__glyphs">` to your file. Use a different HTML element instead of `main` if that suits your setup better.
- Include the CSS file: `<link rel="stylesheet" href="glyph-viewer.css">`
- Include the json file: `<script src="glyphs.json"></script>`
- Include the JavaScript file: `<script src="glyph-viewer.js"></script>`




Cobbled together with the help of a whole load of websites and view source. Thank you everyone. 

You can view it in action here: https://jokedewinter.github.io/glyph-viewer/

 
