window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}
console.log("User is: " + getCookie("id"));
let films = [];


let socket = new WebSocket(location.origin.replace(/^http/, 'ws'));
socket.onopen = function() {
    console.log("[open] Connection established, Sending to server");
    socket.send(JSON.stringify({"action":"waitLogin", "id":getCookie("id")}))
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