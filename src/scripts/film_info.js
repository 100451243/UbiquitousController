const title = document.getElementById("name");

const logo = document.getElementById("logo");

const player = document.getElementById("player");

const arg = document.getElementById("argument");
arg.innerText = "Argumento";

const year = document.getElementById("year");

const director = document.getElementById("people");


const sinopsis = document.getElementById("sinopsis");
sinopsis.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

function display_movie_info(movie) {
    logo.src = "filmsLink/" + movie.foldername + "/logo.png";
    player.poster = "filmsLink/" + movie.foldername + "/landscape.jpg";
    title.innerText = movie.title;
    arg.innerText = movie.metadata.plot;
    year.innerText = movie.metadata.year;
    director.innerText = movie.metadata.director;
}


var video = document.getElementById("player");

function zoom_in() {
    // video.style.width = "100vw";
}

function zoom_out() {
    //video.style.width = "50%";
}

function fast_forward () {
    video.currentTime += 10;
}

function restart () {
    video.currentTime = 0;
}

function play_pause () {
    if (video.paused){
        video.play();
    } else {
        video.pause(); 
    }
}

