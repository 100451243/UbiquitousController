// Source file for the communication between the mobile app and the server
var context = null;
// Obtain the cookie from the browser
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
                context = data.context;
                break;
            case "watching":
                display_cross(data.watching);
                break;
        }
    } catch (e) {
        console.log("Error when receiving message")
    }
};

function send_movement(movement) {
    socket.send(JSON.stringify({"action":`${movement}`, "id":getCookie("id")}))
}

function send_knob(value) {
    socket.send(JSON.stringify({"action":"knob", "id":getCookie("id"), "value":value}))
}


