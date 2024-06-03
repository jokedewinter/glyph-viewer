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

// Load the font
const buffer = fetch('/_assets/fonts/average/Average-240327-059-Regular.woff').then(res => res.arrayBuffer());

// Parse into a Font instance
buffer.then(data => {
    const font = opentype.parse(data).glyphs;
	// The glyphs array sits inside another glyphs array in font
	glyphs = font.glyphs;
    //console.log(glyphs);
    //console.log(glyphs[11].name);

	
	for ( var i = 0; i < font.length; i++ ) {
		//console.log(glyphs[i].name + ' ' + glyphs[i].unicode);
		var name = glyphs[i].name;
		var unicode = glyphs[i].unicode;
		console.log(name + ' ' + unicode + ' ' + String.fromCharCode(unicode));
		const character = String.fromCharCode(unicode);
		list.push("<a href='#' data-glyph='" + character + "'>" + character + "</a>");

	}
})

//console.log(list);

document.getElementById('glyphs').innerHTML = list.join('');
window.scroll({top: 0, left: 0, behavior: 'smooth'});


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
