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
        console.log("received message from server: " + data);
        if (data.id !== getCookie("id")) {
            return;
        }
        switch (data.action) {
            case "infoResponseToPhone":
                console.log("infoResponseToPhone: " + data.context)
                context = data.context;
                switch (context) {
                    case "movie":
                        display_cross(true);
                        break;
                    case "menu":
                        display_cross(false);
                }
                break;
        }
    } catch (e) {
        console.log("Error when receiving message")
    }
};

function send_movement(movement) {
    console.log("Sending movement: " + movement)
    socket.send(JSON.stringify({"action":`${movement}`, "id":getCookie("id")}))
}

function send_knob(value) {
    console.log("Sending knob: " + value)
    socket.send(JSON.stringify({"action":"knob", "id":getCookie("id"), "value":value}))
}


