const title = document.getElementById("name");
title.innerText = "Titulo";

const logo = document.getElementById("logo");
logo.src = "../images/foto.jpg";

const player = document.getElementById("player");
player.poster = "../images/foto.jpg";

const arg = document.getElementById("argument");
arg.innerText = "Argumento";

const sinopsis = document.getElementById("sinopsis");
sinopsis.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

function display_moive_info(movie) {
    logo.src = movie.foldername + "/folder.jpg";
    player.poster = movie.foldername + "/folder.jpg";
    title.innerText = movie.title;
}

function zoom_in() {
    var element = document.getElementById("player");
    element.style.width = "100%";
}

function zoom_out() {
    var element = document.getElementById("player");
    element.style.width = "50%";
}