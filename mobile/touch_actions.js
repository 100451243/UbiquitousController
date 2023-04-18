var main_screen = document.querySelector("#main-screen");
main_screen.addEventListener("touchstart", handleTouchStart, false);        
main_screen.addEventListener("touchmove", handleTouchMove, false);
main_screen.addEventListener("click", tap, false);
main_screen.addEventListener("dblclick", double_tap, false);

var xDown = null;                                                        
var yDown = null;                        

// Gets the position of the initial touch
function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;
};      

// Classifies the movement of the fingen
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
            // Left swipe
            left_swipe();
        } else {
            // Right swipe
            right_swipe();
        }                       
    } else {
        if ( yDiff > 0 ) {
            // Up swipe
            up_swipe();
        } else { 
            // Down swipe
            down_swipe();
        }                                                                 
    }
    // Reset values
    xDown = null;
    yDown = null;                                             
};

var squiggle_svg = document.querySelector("#squiggle-svg");
var squiggle = document.querySelector("#squiggle");
squiggle.style.display = "none";
squiggle.addEventListener("animationend", (evt) => {squiggle.style.display = "none"});

function left_swipe(){
    if (squiggle.style.display == "none"){
        squiggle.style.display = "inline";
        squiggle_svg.style.transform = "rotate(180deg)";
    }
}

function right_swipe(){
    if (squiggle.style.display == "none"){
        squiggle.style.display = "inline";
        squiggle_svg.style.transform = "rotate(0deg)";
    }
}

function up_swipe(){
    if (squiggle.style.display == "none"){
        squiggle.style.display = "inline";
        squiggle_svg.style.transform = "rotate(270deg)";
    }
}

function down_swipe(){
    if (squiggle.style.display == "none"){
        squiggle.style.display = "inline";
        squiggle_svg.style.transform = "rotate(90deg)";
    }
}

function tap(evt) {
    tap_timeout = setTimeout(() =>{
        let circle = document.querySelector("#circle-tap");
        circle.style.left = `${evt.clientX}px`;
        circle.style.top = `${evt.clientY}px`;
        circle.style.border = "0 solid green"
        circle.style.animation = "tapCircle 0.3s linear infinite"
        setTimeout(() => {
            circle.style.animation = ""
        }, 300);
    }, 1000);
};

function double_tap(evt) {
    clearTimeout(tap_timeout);
    let circle = document.querySelector("#circle-tap");
    circle.style.left = `${evt.clientX}px`;
    circle.style.top = `${evt.clientY}px`;
    circle.style.border = "0 solid red"
    circle.style.animation = "tapCircle 0.3s linear infinite"
    setTimeout(() => {
        circle.style.animation = ""
    }, 300);
};