// Animation for all the touch actions

var squiggle_svg = document.querySelector("#squiggle-svg");
var squiggle = document.querySelector("#squiggle");
squiggle.style.display = "none";
squiggle.addEventListener("animationend", (evt) => {squiggle.style.display = "none"});

function animate_swipe(angle){
    if (squiggle.style.display == "none"){
        squiggle.style.display = "inline";
        squiggle_svg.style.transform = `rotate(${angle}deg)`;
    }
}

function animate_tap(x_client, y_client, color){
    let circle = document.querySelector("#circle-tap");
    // Start the animation 
    circle.style.left = `${x_client}px`;
    circle.style.top = `${y_client}px`;
    circle.style.border = `0 solid ${color}`;
    circle.style.animation = "tapCircle 0.3s linear infinite"
    setTimeout(() => {
        circle.style.animation = ""
    }, 300);
}

function animate_hold(){
    window.navigator.vibrate(150);
    if (hold_switch){
        hold_switch = false;
        delete_knob();
    } else {
        hold_switch = true;
        create_knob();
    }
}