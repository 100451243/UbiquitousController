// Source file for the communication between the mobile app and the server
var context = null;
var filterResultBlank = false;
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
    //alert(getCookie("id"));
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
                        context = "movie";
                        display_cross(true);
                        display_microphone(false);
                        disable_filter();
                        break;
                    case "menu":
                        context = "menu";
                        display_cross(false);
                        display_microphone(true);
                }
                break;
            case "noResultsFilter":
                filterResultBlank = true;
                animate_info_circle_open();
                break;
        }
    } catch (e) {
        console.log("Error when receiving message")
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        //alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        alert('Connection with the server has been lost, you must scan a new code');
    }
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

function send_movement(movement) {
    console.log("Sending movement: " + movement)
    socket.send(JSON.stringify({"action":`${movement}`, "id":getCookie("id")}))
}

function send_knob(value) {
    console.log("Sending knob: " + value)
    socket.send(JSON.stringify({"action":"knob", "id":getCookie("id"), "value":value}))
}

function send_filter(filter) {
    console.log("Sending filter: " + filter)
    socket.send(JSON.stringify({"action":"filter", "id":getCookie("id"), "filter":filter}))
}


