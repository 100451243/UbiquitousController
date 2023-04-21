window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}



let socket = new WebSocket(location.origin.replace(/^http/, 'ws'));
socket.onopen = function(e) {
    console.log("[open] Connection established, Sending to server");
    alert("Requesting films")
    socket.send(JSON.stringify({"action":"requestFilms", "id":document.cookie}))
};
socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    try {
        const data = JSON.parse(event.data);
        if (data.action === "reload" && data.id === getCookie("id")) {
            document.location.reload();
            alert("reloading")
        }
        if (data.action === "films"){
            alert("films received")
            var films = data.films;

            let display = document.getElementById("card-columns");
            films.forEach(film => {
                console.log(film)
                let card = document.createElement("div");
                card.className = "card";
                let img = document.createElement("img");
                img.className = "card-img-top";
                img.src = "filmsLink/" + film.foldername + "/folder.jpg";
                let card_body = document.createElement("div");
                card_body.className = "card-body";
                let card_title = document.createElement("h5");
                card_title.className = "card-title";
                card_title.innerHTML = film.title;
                let card_text = document.createElement("p");
                card_text.className = "card-text";
                card_text.innerHTML = film.metadata.tagline;
                let card_footer = document.createElement("div");
                card_footer.className = "card-footer";
                card_footer.innerHTML = film.metadata.rating;
                let card_footer_text = document.createElement("small");
                card_footer_text.className = "text-muted";
                card_footer_text.innerHTML = "    " + film.metadata.year;
                card_footer.appendChild(card_footer_text);
                card_body.appendChild(card_title);
                card_body.appendChild(card_text);
                card.appendChild(img);
                card.appendChild(card_body);
                card.appendChild(card_footer);
                display.appendChild(card);
            });


        }

    } catch (e) {}
};
socket.onclose = function(event) {
    if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
    }
};
socket.onerror = function(error) {
    alert(`[error]` + error.message);
};