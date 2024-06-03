/*
JavaScript for Type Tester

Author: Joke De Winter
Author URI: https://www.jokedewinter.co.uk
Version: 1.0
*/

/* -------------------------------------------------------------
 * Adjust starting font size depending on viewport width
 * Does not update if you change viewport width manually
 * ------------------------------------------------------------- */

var fontSize = document.getElementsByClassName("sizeValue");
var viewport_width = window.innerWidth;

if ( viewport_width <= 720 ) {
	for ( let i = 0; i < fontSize.length; i++ ) {
        fontSize[i].innerHTML = "36 px"; 
    }
} else if ( viewport_width <= 1200) {
	for ( let i = 0; i < fontSize.length; i++ ) {
        fontSize[i].innerHTML = "72 px"; 
    }
} else {
	for ( let i = 0; i < fontSize.length; i++ ) {
        fontSize[i].innerHTML = "125 px"; 
    }
}



/* -------------------------------------------------------------
 * Choose weight
 * ------------------------------------------------------------- */
var selectWeight = document.getElementsByClassName("selectWeight");

for ( let i = 0; i < selectWeight.length; i++ ) {
    selectWeight[i].addEventListener("change", function() {
        
        var chosenWeight = selectWeight[i].value.split(', ');
        document.getElementsByClassName("string")[i].style.fontWeight = chosenWeight[0];
        document.getElementsByClassName("string")[i].style.fontStyle = chosenWeight[1];
        
    }, false);
}


/* -------------------------------------------------------------
 * Choose size
 * ------------------------------------------------------------- */
var selectSize = document.getElementsByClassName("selectSize");

for ( let i = 0; i < selectSize.length; i++ ) {
    selectSize[i].addEventListener("input", function() { 
        
        var chosenSize = selectSize[i].value;
        document.getElementsByClassName("string")[i].style.fontSize = chosenSize + "px";
        document.getElementsByClassName("sizeValue")[i].innerHTML = chosenSize + " px";
        
    }, false);
}

/* -------------------------------------------------------------
 * Choose alignment
 * ------------------------------------------------------------- */
var selectAlignment = document.getElementsByClassName("selectAlignment");

for ( let i = 0; i < selectAlignment.length; i++ ) {

    var chosenAlignment = selectAlignment[i].getElementsByTagName("button");
    
    for ( let j = 0; j < chosenAlignment.length; j++ ) {
        
        chosenAlignment[j].onclick = function() {    

            // You need to have the correct set of buttons to fix the active class
            var buttons = selectAlignment[i].getElementsByTagName("button");
            
            // Remove active class from previous button
            for ( let k = 0; k < buttons.length; k++ ) {
                if ( buttons[k].classList.contains("active") ) {
                    buttons[k].classList.toggle("active");
                }  
            }
            
            this.classList.toggle("active");
            document.getElementsByClassName("string")[i].style.textAlign = this.name;
        }
    } 
} 




