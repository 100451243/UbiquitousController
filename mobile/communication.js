// Source file for the communication between the mobile app and the server

// Obtain the cookie from the browser
window.getCookie = function(name) {
    // Split cookie string and get all individual name=value pairs in an array
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
}

let socket = new WebSocket(location.origin.replace(/^http/, 'ws'));
socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.id != getCookie("id")) {
            return;
        }
        switch (data.action) {
            case "info":
                document.querySelector(".modal-content").innerHTML = data.films;
                break;
        }
    } catch (e) {
        return;
    }
};

function send_movement(movement) {
    socket.send(JSON.stringify({"action":`${movement}`, "id":document.cookie}))
}

function send_knob(value) {
    socket.send(JSON.stringify({"action":"knob", "id":document.cookie, "value":value}))
}


