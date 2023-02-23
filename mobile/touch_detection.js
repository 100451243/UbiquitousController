var main_screen = document.querySelector("#main-screen");
main_screen.addEventListener('touchstart', handleTouchStart, false);        
main_screen.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;                        
                                                                         
function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.targetTouches[0].clientX;                                    
    var yUp = evt.targetTouches[0].clientY;
    
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* right swipe */ 
            console.log("Izquieda");
        } else {
            /* left swipe */
            console.log("Derecha");
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
            console.log("Arriba");                      
        } else { 
            /* up swipe */
            console.log("Abajo");
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};