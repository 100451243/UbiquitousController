window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}
console.log("User is: " + getCookie("id"));
let films = [];

function setRandomBackground(time) {
    let randomFilm = films[Math.floor(Math.random() * films.length)];
    console.log((randomFilm).foldername);

    if (document.getElementById("CurrentBackgroundImage")) {        //remove previous background image
        //animate fade out previous image before removing it
        // let opacity = 0.8;
        // let interval = setInterval(function() {
        //     if (opacity <= 0.1) {
        //         clearInterval(interval);
        //         document.getElementById("CurrentBackgroundImage").remove();
        //     }
        //     opacity -= 0.1;
        //     document.getElementById("CurrentBackgroundImage").style.opacity = opacity;
        // }, 50);
        //
        document.getElementById("CurrentBackgroundImage").remove();
    }

    let image = document.createElement("img");
    image.src = "movies/" + randomFilm.foldername + "/backdrop.jpg";
    image.id = "CurrentBackgroundImage";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.position = "absolute";
    image.style.top = "0";
    image.style.left = "0";
    image.style.zIndex = "-1";
    image.style.opacity = "0";
    image.style.filter = "blur(2px)";
    document.body.appendChild(image);   //set background image
    //animate fadein new image
    let opacity = 0;
    let interval = setInterval(function() {
        if (opacity >= 0.8) {
            clearInterval(interval);
        }
        opacity += 0.1;
        document.getElementById("CurrentBackgroundImage").style.opacity = opacity;
    }, 50);
    setTimeout(function() {             //execute this function every 5 seconds
        setRandomBackground(time);
    }, time);
}



let socket = new WebSocket(location.origin.replace(/^http/, 'ws'));
socket.onopen = function() {
    console.log("[open] Connection established, Sending to server");
    socket.send(JSON.stringify({"action":"waitLogin", "id":getCookie("id")}))
    socket.send(JSON.stringify({"action":"requestFilmsBeforeLogin", "id":getCookie("id")}))
};
socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    try {
        const data = JSON.parse(event.data);
        if (data.action === "reload" && data.id === getCookie("id")) {
            document.location.reload();
            //alert("reloading")
        }
        if(data.action === "disconnect"){
            document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.location.reload();
        }
        if (data.action === "filmsInfo"){
            films = data.films;
            console.log(films)
            setRandomBackground(8000);
        }
    } catch (e) {}
};
socket.onclose = function(event) {
    if (event.wasClean) {
        //alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
    }
};
socket.onerror = function(error) {
    alert(`[error]` + error.message);
};