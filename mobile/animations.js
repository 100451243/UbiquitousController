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
    window.navigator.vibrate([150, 75, 100]);
}

function animate_info_circle_open(){
    let info_circle = document.querySelector("#info-circle");
    let modal_info = document.querySelector("#modal-info-box");
    // Animate the change
    modal_info.style.animation = "infoModalOpen 0.5s ease";
    modal_info.style.display = "block";

    setTimeout(() => {
        modal_info.style.animation = "";
    }, 500);
}

function animate_info_circle_close(){
    let modal_info = document.querySelector("#modal-info-box");
    // Animate the change
    modal_info.style.animation = "infoModalClose 0.5s ease";
    setTimeout(() => {
        modal_info.style.animation = "";
        modal_info.style.display = "none";
    }, 500);
}

function animate_zoom_in(){
    let zoom_in = document.querySelector("#zoom-square");
    zoom_in.style.animation = "zoomIn 0.5s ease";
    zoom_in.style.display = "block";
    setTimeout(() => {
        zoom_in.style.animation = "";
        zoom_in.style.display = "none";
    }, 500);
}

function animate_zoom_out(){
    let zoom_out = document.querySelector("#zoom-square");
    zoom_out.style.animation = "zoomOut 0.5s ease";
    zoom_out.style.display = "block";
    setTimeout(() => {
        zoom_out.style.display = "none";
        zoom_out.style.animation = "";
    }, 500);
}