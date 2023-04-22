window.getCookie = function(name) {
    // Split cookie string and get all individual name=value pairs in an array
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
}

let socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

socket.onopen = function() {
    alert(getCookie("id"));
    socket.send(JSON.stringify({"action":"validated", "id":getCookie("id")}))
}
socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.id !== getCookie("id")) {
            return;
        }
        switch (data.action) {
            case "info":
                // Send the context into the server
                send_context("movie");
                break;
            case "film-info":
                // All data from the movie from the movie
                let film = JSON.parse(data.film);
                display_movie(info);
                break;
            case "zoom-in":
                zoom_in();
                break;
            case "zoom-out":
                zoom_out();
                break;
            case "left-swipe":
                rewind();
                break;
            case "right-swipe":
                fast_forward();
                break;
            case "up-swipe":
                // Swipe up
                break;
            case "down-swipe":
                // Swipe down
                break;
            case "tap":
                play_pause();
                break;
            case "double-tap":
                like_dislike();
                break;
            case "knob":
                volume(data.value);
                break;
            case "shake":
                exit_film();
                break;
            case "landscape":
                // Landscape
                break;
            case "portrait":
                // Portrait
                break;
        }
    } catch (e) {
        console.log("Error when receiving message")
    }
};

function send_context(context) {
    socket.send(JSON.stringify({"action":"info", "id":getCookie("id"), "context":context}))
}

function send_movie_query(id) {
    socket.send(JSON.stringify({"action":"movie", "id":getCookie("id"), "id":query}))
}