/*
JavaScript for Viewing glyphs

Author: Joke De Winter
Author URI: https://www.jokedewinter.co.uk
Version: 1.0
*/

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
