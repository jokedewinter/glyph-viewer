/*
 * Glyph viewer
 *
 * Author: Joke De Winter
 * Author URI: https://www.jokedewinter.co.uk
 * Version: 2.0
 * Year: 2024, 2026
 */
 
/*
 * Metrics and fonts
{
    "upm": 1000, 
    "metrics": [720, 680, 500, 240], 
    "fonts": [
        ["Apium Light", 300, false], ["Apium Light Italic", 300, true], ["Apium Regular", 400, false], ["Apium Regular Italic", 400, true], ["Apium Medium", 500, false], ["Apium Medium Italic", 500, true], ["Apium Bold", 700, false], ["Apium Bold Italic", 700, true], ["Apium Black", 900, false], ["Apium Black Italic", 900, true]]
},
 * metrics: [ascender, cap_height, x_height, descender]
 * font: [font_name, weight, is_italic]
 *
 *
 * A single glyph
 
 * ["Aacute.ss02", "\u00c1", 193, "Latin Capital Letter A With Acute", "\u00c1 + ss02"]     
 * [name, string, unicode (decimal), unicode name, components]
 */



function fetch_json(response_promise) {
    /*
     * It all starts here */
     
    document.addEventListener('DOMContentLoaded', function() {
        response_promise
            .then(response => response.json()
            .then(data => {
                // Create the glyph grid
                create_glyph_grid(data);
                // The first element of the response is the UPM/metrics data
                // To show the first glyph you need the second element
                // With fallback in case it's a glyph that needs css to display correctly
                if ( data[1]['css'] ) { 
                    show_glyph(data[1]['glyphs'][0], data[0]['css']); 
                    show_glyph_info(data[1]['glyphs'][0], data[0]['css']); 
                } else { 
                    show_glyph(data[1]['glyphs'][0], ""); 
                    show_glyph_info(data[1]['glyphs'][0], ""); 
                }
                // Respond to clicks and hovers
                document.querySelectorAll('#glyph_list a').forEach(function(anchor) {
                    anchor.addEventListener('mouseover', fetch_glyph_selection);
                    anchor.addEventListener('mouseclick', fetch_glyph_selection);
                });
            }))
    }, false)
}



function metrics_info(data) {
    /*
     * Fetch the UPM and metrics from the json file 
     * Then add it as a dataset to the glyph_list element */
    
    let metrics_list = new Array();
    let upm = data[0]['upm'];
    
    // Scale is the fontsize in px divided by the upm
    let scale = 360 / upm;

    // Calculate the metric lines
    let ascender = upm - (data[0]['metrics'][0] + data[0]['metrics'][3]);
    let cap_height = Math.round((ascender + (data[0]['metrics'][0] - data[0]['metrics'][1])) * scale);
    let x_height = Math.round((ascender + (data[0]['metrics'][0] - data[0]['metrics'][2])) * scale);
    let baseline = ascender + data[0]['metrics'][0];
    let descender = Math.round((baseline + data[0]['metrics'][3]) * scale);
    
    ascender = Math.round(ascender * scale);
    baseline = Math.round(baseline * scale);

    metrics_list = [ascender, cap_height, x_height, baseline, descender];
    
    // Add the metrics to glyph_list as a dataset
	document.getElementById("glyph_list").dataset.metrics = metrics_list;
    
    // Add the weight of the first font as the start value for glyph_list and glyph_box
	document.getElementById("glyph_list").style.fontWeight = data[0]['fonts'][0][1];
	document.getElementById("glyph_box").style.fontWeight = data[0]['fonts'][0][1];

    // Add the style of the first font as the start value for glyph_list and glyph_box
    if ( data[0]['fonts'][0][2] ) { 
    	document.getElementById("glyph_list").style.fontStyle = 'italic';
    	document.getElementById("glyph_box").style.fontStyle = 'italic';
    }
}



function font_info(data) {
    /*
     * The fonts are listed alongside the upm and metrics
     * This is a list containing a two item list for each font
     * Each font has a nice name, and a weight value */

    font_list = new Array();
    font_list = data[0]['fonts'];
    
    // Create a select option for the different fonts
    create_font_selection(font_list);
}



function create_font_selection(font_list) {

    let selected = '';
    var glyph_font = new Array();
    
    // ___ the font style selection
    glyph_font.push('<dl>');
    glyph_font.push('<dt>Font style</dt> ');
    glyph_font.push('<dd><select id="select_font" onchange="fetch_font_selection()">');

    for ( var f = 0; f < font_list.length; f++ ) {
        // f counts the fonts
        if ( 0 == f ) { selected = 'selected'; }
        else { selected = ''; }
        glyph_font.push('<option value="' + font_list[f][1] + ', ' + font_list[f][2] + '" ' + selected + '>' + font_list[f][0] + '<span class="arrow_down"></span></option>');
    }
    
    glyph_font.push('</select></dd></dl>');
    document.getElementById('glyph_font').innerHTML = glyph_font.join('');
}



function create_glyph_grid(data) {
    /*
     * Use the json data to create a glyph grid
     * The first element in the data is the metrics info and the list of fonts
     * The remaining elements are the glyphs split up in category groups
     * Some groups require css to display correctly (eg. stylistic sets) */
    
    metrics_info(data);
    font_info(data);
    
    var glyph_list = new Array();
    for ( var i = 1; i < data.length; i++ ) {
        // i counts the category groups
        // Starts at 1 to jump over the metrics info

        glyph_list.push('<article>');
        
        // Check for a category name
        var category_name = data[i]['category'];
        if ( data[i]['category_name'] ) {
            category_name = data[i]['category_name'] + ' (Stylistic set ' + data[i]['category'] + ')';
        }
        glyph_list.push('<h3>' + category_name + '</h3>');
        
        // Check for a CSS class in the category 
        var glyph_css_class = '';
        if ( data[i]['css'] ) {
            glyph_css_class = 'class="' + data[i]['css'] + '"';
        }

        // Collect the glyphs
        var glyphs = data[i]['glyphs'];
        
        // j counts the glyphs in a category
        for ( var j = 0; j < glyphs.length; j++ ) {
                          
            // Fix some things first before adding the glyph to the grid
            // 1. The quotedbl glyph gives an issue by being a double quote
            //    So some trickery needs to take place 
            // 2. Ligature glyphs have unicodes made up of all components
            //    These are stored as lists in json
            //    Javascript unhelpfully delists them, but stringify undoes this
            
            var safeguard_id;
            var safeguare_date;
            if ( '"' == glyphs[j][1] ) {
                // Deal with quotedbl
                safeguard_id = encodeURIComponent(glyphs[j][1]);
                safeguard_data = encodeURIComponent(glyphs[j]);
            } else if ( glyphs[j][2].length ) {
                // Deal with ligatures
                safeguard_id = glyphs[j][1];
                glyphs[j][2] = JSON.stringify(glyphs[j][2]);
                glyphs[j][2] = glyphs[j][2].replaceAll(",", "+");
                safeguard_data = glyphs[j];
            } else {
                safeguard_id = glyphs[j][1];
                safeguard_data = glyphs[j];
            }
            
            glyph_list.push('<a id="' + safeguard_id + '" ' + glyph_css_class + ' href="#' + safeguard_id + '" data-glyph-info="' + safeguard_data + '">' + glyphs[j][1] + '</a>');
        }
        glyph_list.push('</article>');
    }
    document.getElementById('glyph_list').innerHTML = glyph_list.join('');
//    window.scroll({top: 0, left: 0, behaviour: 'smooth'});    
}



function fetch_glyph_selection(event) {
    /*
     * On click/mouseover show the chosen glyph
     * Fetch the data values to show the glyph info */
        
    event.preventDefault();
    const glyph_css = this.className;

    var glyph_info;
    if ( "%22" == this.getAttribute('id') ) {
        // The quotedbl glyph is encoded
        // Check the id attribute and decode quotedbl
        glyph_info = decodeURIComponent(this.getAttribute('data-glyph-info'));

    } else { glyph_info = this.getAttribute('data-glyph-info'); }
    
    glyph_info = glyph_info.toString().split(',');
    show_glyph(glyph_info, glyph_css);
    show_glyph_info(glyph_info, glyph_css);
}



function fetch_font_selection() {
    /*
     * On select change font and style
     * The option value contains values for both, separated by a comma
     * Split the string first into an array */
     
    let selected_font = document.getElementById("select_font").value;
    const selected = selected_font.split(', ');

    document.getElementById('glyph_box').style.fontWeight = selected[0];    
    document.getElementById('glyph_list').style.fontWeight = selected[0];

    // Add the style if true
    let style = 'normal';
    if ( "true" == selected[1] ) { style = 'italic'; }
    
    document.getElementById("glyph_list").style.fontStyle = style;
    document.getElementById("glyph_box").style.fontStyle = style;
}



function show_glyph(glyph_info, css) {
    /*
     * This shows just the selected glyph on its own
     * With a css class, if required */
    
    let glyph = glyph_info[1];
    let metrics = document.getElementById("glyph_list").getAttribute('data-metrics').split(",");
    
    // Set up the glyph display
    var glyph_box = new Array();

    glyph_box.push('<p class="glyph ' +  (css ? css : "") + '"><span>' + glyph + '</span></p>');
    glyph_box.push('<hr class="metric_line ascender" style="top: ' + metrics[0] + 'px">');
    glyph_box.push('<hr class="metric_line capheight" style="top: ' + metrics[1] + 'px">');
    glyph_box.push('<hr class="metric_line xheight" style="top: ' + metrics[2] + 'px">');
    glyph_box.push('<hr class="metric_line baseline" style="top: ' + metrics[3] + 'px">');
    glyph_box.push('<hr class="metric_line descender" style="top: ' + metrics[4] + 'px">');
            
    document.getElementById('glyph_box').innerHTML = glyph_box.join('');
}



function show_glyph_info(glyph_info, css) {
    /*
     * All glyphs have their glyph info in an array
     * Ligatures are a comma separated string
     * Different treatments for each */
    
    // First find all the info you need
    let glyph_name = glyph_info[0];
    let unicode_name = glyph_info[3];
    let unicode_dec;
    let unicode_hex = '';
    let glyph_components = glyph_info[4];
    
    if ( "liga" == css ) {
        // It is a ligature
        unicode_dec = glyph_info[2].toString().replace("[", "").replaceAll("+", ", ").replace("]", "");   
        let unicode_list = unicode_dec.split(', ');
        for ( var h = 0; h < unicode_list.length; h++ ) {
           // h counts the number of unicodes
           unicode_hex += unicode_list[h].toString(16).padStart(4, '0');
           if ( h < (unicode_list.length - 1) ) { unicode_hex += ', '; }
        }
    } else {
        // It's a normal glyph
        unicode_dec = glyph_info[2];        
        unicode_hex = glyph_info[2].toString(16).padStart(4, '0');
    }
    
    // Set up the info display
    var glyph_info = new Array();

    glyph_info.push('<dl> ');
    glyph_info.push('<dt>Glyph name</dt> ');
    glyph_info.push('<dd>' + glyph_name + '</dd>');
    
    if ( "" != unicode_name ) {
        glyph_info.push('<dt>Unicode name</dt>');
        glyph_info.push('<dd>' + unicode_name + '</dd>');
    }
    
    glyph_info.push('<dt>Unicode decimal</dt>');
    glyph_info.push('<dd>' + unicode_dec + '</dd>');
    glyph_info.push('<dt>Unicode hex</dt>');
    glyph_info.push('<dd>' + unicode_hex + '</dd>');
    
    if ( "" != glyph_components ) {
        glyph_info.push('<dt>Components</dt>');
        glyph_info.push('<dd>' + glyph_components + '</dd>');
    }
    glyph_info.push('</dl>');
        
    document.getElementById('glyph_info').innerHTML = glyph_info.join('');
}

