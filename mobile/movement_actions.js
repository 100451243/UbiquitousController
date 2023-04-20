// File containing the logic for movement detection

// Shake detection
window.addEventListener('devicemotion', handle_shake, false);
window,addEventListener('orientationchange', handle_orientation, false);

var xBefore, yBefore, zBefore, xAfter, yAfter, zAfter;
var shake_threshold = 15;
var shake_timeout = 1000;
var shake_wait = false;
function handle_shake(evt) {
    xUp = evt.acceleration.x;
    yUp = evt.acceleration.y;
    zUp = evt.acceleration.z;
    let xDiff = xBefore - xAfter;
    let yDiff = yBefore - yAfter;
    let zDiff = zBefore - zAfter;
    if (Math.abs(xDiff) + Math.abs(yDiff) + Math.abs(zDiff) > shake_threshold) {
        if (!shake_wait){
            shake_wait = true;
            send_movement("shake");
            //animate_shake();
            setTimeout(() => {shake_wait = false;}, shake_timeout);
        }
    }
    xBefore = xUp;
    yDown = yUp;
    zDown = zUp;
}

// Orientation detection
var toggle_orientation = true;
function handle_orientation(evt) {
    if (window.innerHeight > window.innerWidth) {
        send_movement("landscape");
        animate_landscape_on();
    } else {
        send_movement("portrait");
        animate_landscape_off();
    }
}


