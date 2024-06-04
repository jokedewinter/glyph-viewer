/*
JavaScript for Viewing glyphs

Author: Joke De Winter
Author URI: https://www.jokedewinter.co.uk
Version: 1.0
*/
/*
https://github.com/opentypejs/opentype.js
https://developer.tizen.org/community/tip-tech/working-fonts-using-opentype.js?langswitchen
*/

// Create an array to display all the glyphs
var list = new Array();

function glyphset_list(font) {
	console.log(font);
	// The glyphs array sits inside another glyphs array in font
	glyphset = font.glyphs;
    console.log(glyphset);
    console.log(glyphset.length);
	
	list.push('<article>');
	for ( var i = 0; i < glyphset.length; i++ ) {
		
//		console.log(glyphset.glyphs[i].name + ' ' + glyphset.glyphs[i].unicode);
		var name = glyphset.glyphs[i].name;
		var unicode = glyphset.glyphs[i].unicode;
		const character = String.fromCharCode(unicode);
//		const character = name;
		if (unicode) {
			list.push("<a href='#' data-glyph='" + character + "'>" + character + "</a>");
		}

	}

	list.push('</article>');
	document.getElementById('glyphs').innerHTML = list.join('');
	window.scroll({top: 0, left: 0, behavior: 'smooth'});
}

opentype.load('/_assets/fonts/average/Average-240327-059-Regular.woff', function (err, font) {
    if (err) {
        alert('Can not load font');
        return;
    }
    
    /* Do something with the font */
	glyphset_list(font);
});





// Listen for button hovers
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.glyphs a').forEach(function(anchor) {
		
        anchor.addEventListener('mouseover', function(event) {
			// Prevent the default action            
			event.preventDefault(); 
            // Get the data-glyph attribute
            var current = this.getAttribute('data-glyph');
            // Collect the element to display the glyph
            var glyph = document.getElementById('glyph');
            // Show requested glyph
			glyph.innerHTML = current;
        });
    });

});
