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
    window.navigator.vibrate([250]);
}

function animate_info_circle_open(){
    let landscape = document.querySelector("#main-screen-landscape");
    let modal_info = document.querySelector("#modal-info-box");
    let info_msg = document.querySelector(".modal-content");
    if (context == "menu"){
        if(filterResultBlank){
            info_msg.innerHTML= "🚫 No movies 🎬 have been found for your 🗣️ voice search. Please press the ❌ cross icon and try again."
        }else{
            info_msg.innerHTML = "- 👉 Swipe your finger to any direction to move the cursor ➡️ ⬅️ ⬇️ ⬆️ <br>\n" +
                "- 👆 Tap the microphone 🎤 to️ voice search 🗣️ for a movie 🎬 <br>\n" +
                "- 👆 Tap in the blank space to select a movie 🎬";
        }
    } else if (context == "movie"){
        info_msg.innerHTML = "- 🔊 Hold the screen to open the volume knob 🎚️<br>\n" +
            "- 👈👉 Swipe left or right to seek 10 seconds, slide up and down for greater increments 🎞️<br>\n" +
            "- 🤏 Pinch to zoom in/out 🔍 <br>\n" +
            "- 👆 Tap to play/pause ▶️⏸️<br>\n" +
            "- 👆👆 Double tap to like/dislike 💖💔 <br>\n" +
            "- 🔄 Turn your phone sideways and back to portrait mode to activate subtitles <br>\n" +
            "- ✖ Tap the cross or shake the phone to exit 🚪";
    } else{
        info_msg.innerHTML = "Waiting for the server...";
    }

    // Animate the change
    modal_info.style.animation = "infoModalOpen 0.5s ease";
    modal_info.style.display = "block";
    landscape.style.display = "flex";

    setTimeout(() => {
        modal_info.style.animation = "";
    }, 500);
}

function animate_info_circle_close(){
    let landscape = document.querySelector("#main-screen-landscape");
    let modal_info = document.querySelector("#modal-info-box");
    // Animate the change
    modal_info.style.animation = "infoModalClose 0.5s ease";

    setTimeout(() => {
        modal_info.style.animation = "";
        modal_info.style.display = "none";
        landscape.style.display = "none";
    }, 500);
}

function animate_zoom_in(){
    let zoom_in = document.querySelector("#zoom-square");
    zoom_in.style.animation = "zoomIn 0.5s ease";
    zoom_in.style.display = "block";
    zoom_in.style.borderColor = blue;
    setTimeout(() => {
        zoom_in.style.animation = "";
        zoom_in.style.display = "none";
    }, 500);
}

function animate_zoom_out(){
    let zoom_out = document.querySelector("#zoom-square");
    zoom_out.style.animation = "zoomOut 0.5s ease";
    zoom_out.style.display = "block";
    zoom_out.style.borderColor = blue;
    setTimeout(() => {
        zoom_out.style.display = "none";
        zoom_out.style.animation = "";
    }, 500);
}
function animate_landscape_on(){
    let phone = document.querySelector("#rotate-phone");
    let landscape = document.querySelector("#main-screen-landscape");
    let rotating_arrow = document.querySelector("#rotate-phone > i");
    phone.style.animation = "sizeIncrease 0.5s forwards ease, borderIncrease 0.5s 0.5s forwards ease, rotateLeft 0.7s 1s forwards ease";
    rotating_arrow.style.animation = "fadeIn 0.5s 0.8s forwards ease";
    landscape.style.display = "flex";
    landscape.style.zIndex = "10000";
}

function animate_landscape_off(){
    let phone = document.querySelector("#rotate-phone");
    let landscape = document.querySelector("#main-screen-landscape");
    let rotating_arrow = document.querySelector("#rotate-phone > i");
    phone.style.animation = "";
    rotating_arrow.style.animation = "";
    landscape.style.display = "none";
    landscape.style.zIndex = "100";
}

function animate_shake(){
    window.navigator.vibrate([250, 250, 250, 250, 250]);
}

function display_cross(value){
    close_button = document.querySelector("#close-button");
    if (value) {
        close_button.style.display = "block";
    }
    else {
        close_button.style.display = "none";
        showing_knob = false;
    }
}

function display_microphone(value){
    let microphone = document.querySelector("#microphone");
    if (value) {
        microphone.style.display = "block";
    }
    else {
        microphone.style.display = "none";
    }
}

function disable_filter(){
    microFilterActive = false;
}