/*
JavaScript for Viewing glyphs

Author: Joke De Winter
Author URI: https://www.jokedewinter.co.uk
Version: 1.0
*/

// Load the json file
var charset = charset;

function create_glyph_grid() {

	var list = new Array();
	
	// Display the glyphs in category groups
	for ( var i = 0; i < charset.length; i++ ) {
		
		list.push('<article>');
		list.push('<h3>' + charset[i]['category'] + '</h3>');
		
		var chars = charset[i]['chars'];		
		
		for ( j = 0; j < chars.length; j++ ) {
			
			const unicodeValue = chars[j];
	
			/*
			 * Use this if the json file has unicode values
			 * using the UTF-8 format */
			const character = String.fromCharCode(parseInt(unicodeValue, 16));		
	
			/*
			 * Use this if the json file has either string values
			 * or unicodes from string values */
			//const character = unicodeValue; 
			
			if ( character ) {
				list.push('<a id="' + character + '" href="#' + character + '" data-glyph="' + character + '">' + character + '</a>');
			}
		}
		
		list.push('</article>');	
	}
	
	document.getElementById('glyphs').innerHTML = list.join('');
	window.scroll({top: 0, left: 0, behavior: 'smooth'});
}

// Choose a different font
function chooseFont() {
  	var chosenFont = document.getElementById("selectFont").value;
	document.getElementById("glyphs").style.fontWeight = chosenFont;
	document.getElementById("glyph").style.fontWeight = chosenFont;
}

// Display the chosen glyph
function showGlyph(event) {
	event.preventDefault(); 
    var current = this.getAttribute('data-glyph');
	var glyph = document.getElementById('glyph');
	glyph.innerHTML = current;
}

// Listen for button hovers/clicks
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.glyphs a').forEach(function(anchor) {
		
		anchor.addEventListener('mouseover', showGlyph);
		anchor.addEventListener('mouseclick', showGlyph);

	});	
});

create_glyph_grid();
