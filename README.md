# Glyph Viewer

A viewing tool for all the glyphs in a font file. It uses a json file with all glyphs in a font to create a grid on the page. Javascript is used to read the json file and show a larger version of the glyph on tap/click/hover. There is a simple fallback for narrow viewports.

The json file is generated inside Glyphs. The first element is a dictionary containing the upm, the metrics (as averages of all the masters), and a list of active export instances. 

Demo: https://jokedewinter.github.io/glyph-viewer/

## Requirements

A json file with the required information. Use the script `glyphs-script/jdw-glyphset.py` in Glyphs to create the file. The json file will be saved to your desktop.

## Use

### The files you will need from this repository
- `assets/css/glyph-viewer.css`
- `assets/js/glyph-viewer.js` 

### HTML
Add this to your html file:
```
    <section class="module__glyph_viewer">
        <div class="glyph_view">
            <figure id="glyph_box"></figure>
            <div id="glyph_font"></div>
            <div id="glyph_info"></div>
        </div>
        <section id="glyph_list" class="vscrolling">
        </section>
    </section>
```

Include the CSS file: `<link rel="stylesheet" href="glyph-viewer.css">`
Include the JavaScript file: `<script src="glyph-viewer.js"></script>`
Include the kickoff at the bottom of your html file: 
```
    <script>
        let response_promise = fetch('./NAME_OF_YOUR_JSON_FILE.json');
        fetch_json(response_promise);
    </script>
```


Cobbled together with the help of a whole load of websites and view source. Thank you everyone. 
No AI was used in the process. 
