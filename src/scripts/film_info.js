const title = document.getElementById("title");
const ratings = document.getElementById("ratings");
const player = document.getElementById("player");
const background = document.getElementById("background");
const sinopsis = document.getElementById("sinopsis");
const info = document.getElementById("info");
const poster_image = document.getElementById("poster_image");
const movie = document.getElementById("movie");
const like_button = document.getElementById("like-button");

// On load, get the movie info
window.onload = function() { display_movie_info("movie") };
let first_tap = true;

function display_movie_info(movie) {
    //player.poster = "filmsLink/" + movie.foldername + "/landscape.jpg";
    //banner.style.background = "url(filmsLink/" + movie.foldername + "/backdrop.jpg)";
    background.style.background = "url(../images/backdrop.jpg)";
    background.style.backgroundSize = "cover"
    // sinopsis.innerHTML = movie.metadata.plot
    sinopsis.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    // title.innerHTML = movie.title;
    title.innerHTML = "Titulo";
    // calculate_star_rating(movie.metadata.rating);
    calculate_star_rating(3);
    // info.innerHTML = "Género: " + movie.metadata.genre + "<span>|</span>" + "Año: " + movie.metadata.year + "<span>|</span>"  + "Director: " + movie.metadata.director
    info.innerHTML = "Género: XXX" + "<span>|</span>" + "Año: XXX" + "<span>|</span>"  + "Director: XXX"
    setTimeout (function() {
        play_pause();
    }, 1000);
    setTimeout (function() {
        subtitles();
    }, 2000);
    
    
}

function calculate_star_rating(rating) {
    // Map 1 tp 10 to 1 to 5
    let stars = Math.round(rating / 2);
    let icons = ratings.children;
    for (let i = 0; i < icons.length; i++) {
        if (i < stars) {
            icons[i].className = "fa fa-star";
        } else {
            icons[i].className = "fa fa-star inactive";
        }
    }

    return stars;
}

var video_x = movie.style.left;
var video_y = movie.style.top;

function zoom_in() {
    movie.style.width = "100vw";
    movie.style.height = "100vh";
    movie.style.top = "0";
    movie.style.left = "0";
    movie.style.position = "fixed";
    movie.style.transform = "translate(0, 0)";
    movie.style.zIndex = "1000";
}

function zoom_out() {
    movie.style.width = "500px";
    movie.style.height = "300px";
    movie.style.transform = "translate(-175px, 0)";
    movie.style.borderRadius = "0.5em";
    movie.style.top = video_y;
    movie.style.left = video_x;
    movie.style.position = "relative";
}

function fast_forward () {
    movie.currentTime += 10;
}

function rewind () {
    movie.currentTime -= 10;
}

function restart () {
    movie.currentTime = 0;
}

function play_pause () {
    if (first_tap) {
        first_tap = false;
        poster_image.style.animation = "posterAnimation 0.4s ease-out forwards"
        setTimeout(function(){ 
            movie.style.display = "block";
            movie.style.animation = "videoAnimation 0.3s ease-out forwards"
            poster_image.style.display = "none";
            
        }, 300);
    }

    if (movie.paused){
        movie.play();
    } else {
        movie.pause(); 
    }
}

like_dislike = function() {
    like_button.style.animation = "likeAnimation 0.3s ease-out infinite"
    setTimeout(() => { like_button.style.animation = ""; }, 300);
    if (like_button.className == "fa fa-heart heart-inactive") {
        like_button.className = "fa fa-heart heart-active";
    } else {
        like_button.className = "fa fa-heart heart-inactive";
    }
}

function volume (vol) {
    movie.volume = vol / 100;
}

function exit_film () {
    window.location.href = "../display-html/index.html"
}

function subtitles () {
    let subs = document.getElementById("subs");
    subs.src = "./The.Matrix.1999.1080p.BrRip.x264.YIFY.eng.srt"
}