var main_screen = document.querySelector("#main-screen");
main_screen.addEventListener("touchstart", handle_touch_start, false);   
main_screen.addEventListener("touchend", handle_touch_end, false);
main_screen.addEventListener("touchmove", handle_touch_move, false);
main_screen.addEventListener("click", handle_tap, false);
main_screen.addEventListener("dblclick", handle_double_tap, false);

const carmine = "#ee6b6e";
const yellow = "#e0d162";
const green = "#77c16c";

var x1Down = null;                                                        
var y1Down = null;                        
var x2Down = null;                                                        
var y2Down = null;                        

// Gets the position of the initial touch
function handle_touch_start(evt) {
    const firstTouch = evt.touches[0];                                      
    x1Down = firstTouch.clientX;                                      
    y1Down = firstTouch.clientY;
    if (evt.touches.length === 2) {
        // Two fingers are touching the screen 
        x2Down = evt.touches[1].clientX;
        y2Down = evt.touches[1].clientY;
    }
    //hold_down(evt);
};


function handle_touch_end(evt) {
    // The user is not holding the screen anymore
    clearTimeout(hold_timeout); 
}

// Classifies the movement of the finger
var one_finger_swipe = true;
function handle_touch_move(evt) {
    if ( ! x1Down || ! y1Down ) {
        return;
    }

    var num_touches = evt.touches.length;
    if (num_touches === 2) {
        // Two fingers are touching the screen
        one_finger_swipe = false;
        handle_two_fingers(evt);
        // Wait 500ms before allowing a swipe
        setTimeout(() => { one_finger_swipe = true; }, 500);
    } else if (one_finger_swipe) {
        // Else, it is a swipe
        handle_swipe(evt);
    }                              
};

// Classifies the movement of two fingers
function handle_two_fingers(evt){

    var x1Up = evt.touches[0].clientX;
    var y1Up = evt.touches[0].clientY;
    var x2Up = evt.touches[1].clientX;
    var y2Up = evt.touches[1].clientY;

    var release_distance = Math.sqrt(Math.pow(x1Up - x2Up, 2) + Math.pow(y1Up - y2Up, 2));
    var initial_distance = Math.sqrt(Math.pow(x1Down - x2Down, 2) + Math.pow(y1Down - y2Down, 2));
    var distance_difference = release_distance - initial_distance;

    // If the distance between the fingers is increasing, it is a zoom
    if (distance_difference > 0){
        console.log("zoom in");
    } else {
        console.log("zoom out");
    }
}

// Classfies the movement of one finger
function handle_swipe(evt){
    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;
    
    var xDiff = x1Down - xUp;
    var yDiff = y1Down - yUp;

    let swipe_threshold = 110;
    // If the movement is less than the threshold, it is not a swipe
    if ( Math.abs( xDiff ) < swipe_threshold && Math.abs( yDiff ) < swipe_threshold && evt.touches.length > 1) {
        return;
    }
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) { //most significant
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
    x1Down = null;
    y1Down = null;   
}

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

var tap_timeout;
function handle_tap(evt) {
    tap_timeout = setTimeout(() =>{
        let circle = document.querySelector("#circle-tap");
        // Start the animation
        circle.style.left = `${evt.clientX}px`;
        circle.style.top = `${evt.clientY}px`;
        circle.style.border = `0 solid ${yellow}`;
        circle.style.animation = "tapCircle 0.3s linear infinite"
        setTimeout(() => {
            circle.style.animation = ""
        }, 300);
    }, 100);
};


function handle_double_tap(evt) {
    clearTimeout(tap_timeout);
    let circle = document.querySelector("#circle-tap");
    // Start the animation
    circle.style.left = `${evt.clientX}px`;
    circle.style.top = `${evt.clientY}px`;
    circle.style.border = `0 solid ${carmine}`;
    circle.style.animation = "tapCircle 0.3s linear infinite"
    setTimeout(() => {
        circle.style.animation = ""
    }, 300);
};

var hold_timeout;
var min_hold_time = 700;
var hold_switch = false;
function hold_down(evt) {
    clearTimeout(tap_timeout);
    hold_timeout = setTimeout(() => {
        if (hold_switch){
            hold_switch = false;
            delete_knob();
        } else {
            hold_switch = true;
            create_knob();
        }
    }, min_hold_time);
}
