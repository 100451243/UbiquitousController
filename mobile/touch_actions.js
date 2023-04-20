// File containing the logic for finger action detection
var main_screen = document.querySelector("#main-screen");

main_screen.addEventListener("touchstart", handle_touch_start, false);   
main_screen.addEventListener("touchend", handle_touch_end, false);
main_screen.addEventListener("touchmove", handle_touch_move, false);
main_screen.addEventListener("click", tap, false);
main_screen.addEventListener("dblclick", double_tap, false);

var info_circle = document.querySelector("#info-circle");
var modal_info = document.querySelector("#button-ok");
info_circle.addEventListener("click", click_info, false);
modal_info.addEventListener("click", exit_info, false);
var showing_info = false;
var showing_knob = false;

const carmine = "#ee6b6e";
const yellow = "#e0d162";
const green = "#77c16c";

var x1Down = null;                                                        
var y1Down = null;                        
var x2Down = null;                                                        
var y2Down = null;                        

// Gets the position of the initial touch
function handle_touch_start(evt) {
    if (showing_info){ return;}
    const firstTouch = evt.touches[0]; 
    x1Down = firstTouch.clientX;                                      
    y1Down = firstTouch.clientY;
    if (evt.touches.length === 2) {
        // Two fingers are touching the screen 
        x2Down = evt.touches[1].clientX;
        y2Down = evt.touches[1].clientY;
    } else {
        // Wait 1s before allowing a hold
        hold_timeout = setTimeout(() => { hold_down(); }, 700);
    }
};

function handle_touch_end(evt) {
    // The user is not holding the screen anymore
    clearTimeout(hold_timeout); 
}

// Classifies the movement of the finger
var one_finger_swipe = true;
function handle_touch_move(evt) {
    clearTimeout(hold_timeout); 
    if ( ! x1Down || ! y1Down || showing_knob) {
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
    clearTimeout(hold_timeout);
    var x1Up = evt.touches[0].clientX;
    var y1Up = evt.touches[0].clientY;
    var x2Up = evt.touches[1].clientX;
    var y2Up = evt.touches[1].clientY;

    // Calculate the distance between the fingers
    var release_distance = Math.sqrt(Math.pow(x1Up - x2Up, 2) + Math.pow(y1Up - y2Up, 2));
    var initial_distance = Math.sqrt(Math.pow(x1Down - x2Down, 2) + Math.pow(y1Down - y2Down, 2));
    var distance_difference = release_distance - initial_distance;
    
    // Threshold for distance
    let two_finger_threshold = 100;
    if (Math.abs(distance_difference) < two_finger_threshold){
        return;
    }

    // If the distance between the fingers is increasing, it is a zoom
    if (distance_difference > 0){
        zoom_in();
    } else {
        zoom_out();
    }
}

var zoom_wait = false;
function zoom_out(){
    if (!zoom_wait){
        zoom_wait = true;
        animate_zoom_out();
        setTimeout(() => {zoom_wait = false;}, 500);
    }
}

function zoom_in(){
    if (!zoom_wait){
        zoom_wait = true;
        animate_zoom_in();
        setTimeout(() => {zoom_wait = false;}, 500);
    }
}

// Classfies the movement of one finger
function handle_swipe(evt){
    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;
    
    var xDiff = x1Down - xUp;
    var yDiff = y1Down - yUp;

    let swipe_threshold = 50;
    // If the movement is less than the threshold, it is not a swipe
    if ( Math.abs(xDiff) + Math.abs(yDiff) < swipe_threshold || evt.touches.length > 1) {
        return;
    }
    if ( Math.abs(xDiff) > Math.abs(yDiff) ) { //most significant
        if (xDiff > 0) {
            // Left swipe
            left_swipe();
        } else {
            // Right swipe
            right_swipe();
        }                       
    } else {
        if (yDiff > 0) {
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

function left_swipe(){
    animate_swipe(180);
}

function right_swipe(){
    animate_swipe(0);
}

function up_swipe(){
    animate_swipe(270);
}

function down_swipe(){
    animate_swipe(90);
}

var tap_timeout;
// Tap event
function tap(evt) {
    if (showing_info){return;}
    tap_timeout = setTimeout(() =>{
        animate_tap(evt.clientX, evt.clientY, green);
    }, 100);
};

// Double tap event
function double_tap(evt) {
    if (showing_info){return;}
    clearTimeout(tap_timeout);
    animate_tap(evt.clientX, evt.clientY, carmine); 
};

var hold_timeout;
var hold_switch = false;
// Hold event
function hold_down() {
    clearTimeout(tap_timeout);
    if (hold_switch){
        hold_switch = false;
    } else {
        hold_switch = true;
        start_voice_recognition();
    }
    animate_hold();
}

// Info circle
function click_info(evt) {
    if (!showing_info) {
        showing_info = true;
        animate_info_circle_open();
        socket.send(JSON.stringify({"action":"requestFilms", "id":getCookie("id")}))
    } 
}

// Exit info
function exit_info() {
    setTimeout(() => { showing_info = false;} , 500);
    animate_info_circle_close();
}