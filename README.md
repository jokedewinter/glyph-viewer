# Glyph Viewer

A website viewing tool for all the glyphs in a font file. It uses a json file with glyph unicodes to read all the glyphs and create a grid on the page. Javascript is used to convert the unicode to readable glyphs and showing a larger version of the glyph on tap/click/hover.

It works on smaller viewports too, but there the chosen glyph opens up inline in the grid. On wide viewports it appears beside the grid.

## Requirements

A json file with unicodes divided into categories (uppercase, lowercase, figures, etc.).

```
	{
		"category": "Symbol", 
		"chars": ["@", "&", "\u00a9", "\u00ae", "\u2122", "|"]
	}, 
```
or 
```
	{
		"category": "Symbol",
		"chars": [
			"0026","0040","007C","00A6","00A7","00A9","2117","00AE","00B0","00B6","2020","2021","2032","2033","2105","2113","2116","2118","211E","2122","2125","212E","214A","2423","0025","002B","003C","003D","003E","007E","00AC","00B1","005E","00B5","00D7","00F7","2030","2031","2052","207A","207B","207C","208A","208B","208C","2126","2127","2135","2136","2137","2138","2140","2141","2142","2143","2144","214B","2212"
		]
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

 
