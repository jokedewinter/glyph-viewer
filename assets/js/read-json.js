/*
JavaScript for Viewing glyphs

Author: Joke De Winter
Author URI: https://www.jokedewinter.co.uk
Version: 1.0
*/

// Convert unicode to glyph
// The unicode value is UTF-8, but String.fromCharCode uses UTF-16.
// The parseInt section converts the unicode from 8 to 16 
// The result is the correct glyph


// Read the charset
var charset = charset;
var list = new Array();

// Display the charset in category groups

for ( var i = 0; i < charset.length; i++ ) {
	
	list.push('<article>');
	list.push('<h3 class="feature">' + charset[i]['category'] + '</h3>');
	
	var chars = charset[i]['chars'];		
	
	for ( j = 0; j < chars.length; j++ ) {
		
		const unicodeValue = chars[j];
		
		// Use this if the json file has unicode values
		//const character = String.fromCharCode(parseInt(unicodeValue, 16));		

		// Use this if the json file has string values
		const character = unicodeValue; 
		
		if ( character ) {
			list.push('<a href="#" data-glyph="' + character + '">' + character + '</a>');
		}
	}
	
	list.push('</article>');	
}


document.getElementById('glyphs').innerHTML = list.join('');
window.scroll({top: 0, left: 0, behavior: 'smooth'});


// Choose a different font
function chooseFont() {
  	var chosenFont = document.getElementById("selectFont").value;
	document.getElementById("glyphs").style.fontWeight = chosenFont;
	document.getElementById("glyph").style.fontWeight = chosenFont;
}

function showGlyph(event) {
	// Prevent the default action            
	event.preventDefault(); 
    // Get the data-glyph attribute
    var current = this.getAttribute('data-glyph');
	// Collect the element to display the glyph
	var glyph = document.getElementById('glyph');
	// Show requested glyph
	glyph.innerHTML = current;
}

// Listen for button hovers
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.glyphs a').forEach(function(anchor) {
		
		anchor.addEventListener('mouseover', showGlyph);
		anchor.addEventListener('touchstart', showGlyph);

	});	
});

