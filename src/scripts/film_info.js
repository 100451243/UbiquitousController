const title = document.getElementById("title");
const ratings = document.getElementById("ratings");
const player = document.getElementById("player");
const background = document.getElementById("background");
const sinopsis = document.getElementById("sinopsis");
const info = document.getElementById("info");
const poster_image = document.getElementById("poster_image");
const movie = document.getElementById("movie");
const like_button = document.getElementById("like-button");
const content = document.getElementById("content");
//const subs = document.getElementById("subs");

// On load, get the movie info
//window.onload = function() { display_movie_info("movie") };  //this is going to be executed only when the film is received on film_socket.js
let first_tap = true;
let filmed;

function display_movie_info(film) {
    filmed = film;
    console.log(film)
    title.innerHTML = film.title;
    calculate_star_rating(film.metadata.rating);
    document.getElementById("tagline").innerHTML = film.metadata.tagline;
    sinopsis.innerHTML = film.metadata.plot;
    info.innerHTML = "Genre: " + film.metadata.genre + "<span>|</span>" + "Duration: " + film.metadata.runtime+"m" + "<span>|</span>" + "Year: " + film.metadata.year + "<span>|</span>"  + "Director: " + film.metadata.director;
    poster_image.src = "/movies/" + film.foldername + "/folder.jpg";
    document.getElementById("logo").src="/movies/" + film.foldername + "/logo.png";

    socket.send(JSON.stringify({"action":"convert","path":"/movies/" + film.foldername + "/" + film.subtitle}));
    console.log("sent request to convert subtitles");

    movie.src = "/movies/" + film.foldername + "/" + film.file;

    document.body.style.backgroundImage = "url('/movies/" + film.foldername+"/backdrop.jpg')"
    document.body.style.backdropFilter = "blur(5px)";
    document.body.style.backgroundRepeat = "no-repeat";
    background.style.backgroundImage = "url(/movies/" + film.foldername + "/landscape.jpg)";
    background.style.backgroundSize = "cover"
    
}


function fill_subtitles(){
    let subtitles = document.createElement("track");
    subtitles.kind = "subtitles";
    subtitles.label = "English";
    subtitles.srclang = "en";
    subtitles.src = "/movies/" + filmed.foldername + "/" + filmed.subtitle;
    subtitles.src = subtitles.src.slice(0, -3) + "vtt";
    subtitles.default = true;
    movie.appendChild(subtitles);
}

let subs_on = true;
function toggle_subs(){
    subs_on = !subs_on;
    document.getElementById("movie").textTracks[0].mode= subs_on ? "showing" : "disabled";
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
    document.body.style.background = "black";
    document.getElementById("banner").style.visibility = "hidden";
    document.getElementById("logo").style.visibility = "hidden";
}

function zoom_out() {
    //remove background color
    //document.body.style.background = "none";
    document.body.style.backgroundImage = "url('/movies/" + filmed.foldername+"/backdrop.jpg')"
    movie.style.width = "1200px";
    movie.style.height = "600px";
    movie.style.borderRadius = "0.5em";
    movie.style.top = video_y;
    movie.style.left = video_x;
    movie.style.position = "relative";
    document.exitFullscreen().then(r => console.log("fullscreen")).catch(e => console.log("error: " + e));
    document.getElementById("banner").style.visibility = "visible";
    document.getElementById("logo").style.visibility = "visible";
}

function fast_forward (amount) {
    movie.currentTime += amount;
}

function rewind (amount) {
    movie.currentTime -= amount;
}

function restart () {
    movie.currentTime = 0;
}

function play_pause () {
    if (first_tap) {
        first_tap = false;
        poster_image.style.animation = "posterAnimation 0.7s ease-out forwards"
        setTimeout(function(){ 
            movie.style.display = "block";
            movie.style.animation = "videoAnimation 0.7s ease-out forwards"
            
        }, 350);
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
    let float = vol / 100;
    movie.volume = float;
}

function exit_film () {
    window.location.href = "/"
}