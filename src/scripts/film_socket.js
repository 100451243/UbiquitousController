window.getCookie = function(name) {
    // Split cookie string and get all individual name=value pairs in an array
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
}
let films = [];

function fulfill_film_info() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const filmID = urlParams.get('film');
    display_movie_info(films[filmID]);
}

let socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

socket.onopen = function() {
    socket.send(JSON.stringify({"action":"requestFilms", "id":getCookie("id")}))
    send_context("movie");
}
socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        // if (data.id !== getCookie("id")) {
        //     return;
        // }
        console.log("received message: " + data);
        console.log(JSON.stringify(data))
        let action_done = data.action;
        switch (action_done) {
            case "subtitleReady":
                fill_subtitles();
                break;
            case "infoRequestToDisplay":
                // Send the context into the server
                send_context("movie");
                break;
            case "films":
                // All data from the movie from the movie
                films = data.films;
                fulfill_film_info();
                break;
            case "zoom_in":
                zoom_in();
                break;
            case "zoom_out":
                zoom_out();
                break;
            case "left-swipe":
                rewind(10);
                break;
            case "right-swipe":
                fast_forward(10);
                break;
            case "up-swipe":
                rewind(600);
                break;
            case "down-swipe":
                fast_forward(600);
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
                break;
            case "portrait":
                toggle_subs();
                break;
            case "disconnect":
                document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.location.reload();
        }
    } catch (e) {
        console.log("Error when receiving message")
        console.log(e)
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        alert('[close] Connection died');
    }
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.location.reload();
};
socket.onerror = function(error) {
    alert(`[error]` + error.message);
};



function send_context(context) {
    socket.send(JSON.stringify({"action":"infoResponse", "id":getCookie("id"), "context":context}))
}

function send_movie_query(id) {
    socket.send(JSON.stringify({"action":"movie", "id":getCookie("id"), "id":query}))
}