window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}


let films = [];
let selected = undefined;

let socket = new WebSocket(location.origin.replace(/^http/, 'ws'));
socket.onopen = function(e) {
    console.log("[open] Connection established, Sending to server");
    //alert("Requesting films")
    socket.send(JSON.stringify({"action":"requestFilms", "id":getCookie("id")}))
    socket.send(JSON.stringify({"action":"infoResponse", "id":getCookie("id"), "context":"menu"}))

};
socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    try {
        const data = JSON.parse(event.data);
        if (data.action === "reload" && data.id === getCookie("id")) {
            document.location.reload();
            //alert("reloading")
        }
        if (data.action === "films"){
            //alert("films received")
            films = data.films;

            let display = document.getElementById("card-columns");
            films.forEach(film => {
                console.log(film)
                let card = document.createElement("div");
                card.className = "card";
                let img = document.createElement("img");
                img.className = "card-img-top";
                img.src = "movies/" + film.foldername + "/folder.jpg";
                //check if img is loaded or is missing
                img.onerror = function() {
                    img.src = "/media/missing.png";
                }
                //set img so it doesnt stretch
                img.style = "object-fit: cover; height: 28rem;";
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
        console.log(selected)
        let display = document.getElementById("card-columns");
        if(data.action === "right-swipe"){
            if (selected === undefined) {
                selected = 0;
            }else{
                display.childNodes[selected].style.backgroundColor = "white";
                display.childNodes[selected].style="animation: none; border-color: none; border-width: 0px;"
                selected++;
            }

            if(selected>display.childNodes.length-1){ selected=0; }
            display.childNodes[selected].style.backgroundColor = "green";
            //make element constant-tilt-shake class
            display.childNodes[selected].style="animation: tilt-n-move-shaking 0.5s 0.2s; border-color: black; border-width: 10px;"
            display.childNodes[selected].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
        if(data.action === "left-swipe"){
            if (selected === undefined) {
                selected = 0;
            }else {
                display.childNodes[selected].style.backgroundColor = "white";
                display.childNodes[selected].style = "animation: none; border-color: none; border-width: 0px;"
                selected--;
            }

            if(selected<0){ selected=display.childNodes.length-1; }
            display.childNodes[selected].style.backgroundColor = "red";//
            display.childNodes[selected].style="animation: tilt-n-move-shaking 0.5s 0.2s; border-color: black; border-width: 10px;"
            display.childNodes[selected].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
        let movement = Math.ceil(window.innerWidth / 300)-1;
        if(data.action === "up-swipe"){
            if (selected === undefined) {
                selected = 0;
            } else  {
                display.childNodes[selected].style.backgroundColor = "white";
                display.childNodes[selected].style="animation: none; border-color: none; border-width: 0px;"
                selected= selected - movement < 0 ? 0 : selected - movement;
            }
            if(selected<0)    { selected=0; }
            display.childNodes[selected].style.backgroundColor = "red";
            display.childNodes[selected].style="animation: tilt-n-move-shaking 0.5s 0.2s; border-color: black; border-width: 10px;"
            display.childNodes[selected].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
        if(data.action === "down-swipe"){
            if (selected === undefined) {
                selected = 0;
            } else  {
                display.childNodes[selected].style.backgroundColor = "white";
                display.childNodes[selected].style="animation: none; border-color: none; border-width: 0px;"
                selected = selected + movement > films.length - 1 ? films.length - 1 : selected + movement;
            }
            if(selected>display.childNodes.length-1)    { selected=display.childNodes.length; }
            display.childNodes[selected].style.backgroundColor = "green";
            display.childNodes[selected].style="animation: tilt-n-move-shaking 0.5s 0.2s; border-color: black; border-width: 10px;"
            display.childNodes[selected].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
        if(data.action === "tap"){
            if (selected === undefined) {
                console.log("Nothing selected");
            }else if(0>5){
                console.log("begin playing")
                let title_image = document.createElement("img");
                title_image.src = "movies/" + films[selected].foldername + "/clearart.png";
                //set image, so it hovers over the top right corner of the video
                title_image.style = "position: absolute; top: 0; right: 0; width: 20%; height: 20%; object-fit: cover;";

                let logo_image = document.createElement("img");
                logo_image.src = "movies/" + films[selected].foldername + "/logo.png";
                //set image, so it hovers over the top left corner of the video
                logo_image.style = "position: absolute; top: 0; left: 0; width: 20%; height: 20%; object-fit: cover;";

                let video = document.createElement("video");
                //video.playsInline = true;
                video.src = "movies/" + films[selected].foldername + "/" + films[selected].file;
                video.controls = true;
                //video.autoplay = true;
                video.play();
                let container = document.createElement("div");
                container.appendChild(logo_image);
                container.appendChild(title_image);
                container.appendChild(video);
                let plot = document.createElement("p");
                plot.innerHTML = films[selected].metadata.plot;
                container.appendChild(plot);
                document.body.innerHTML = container.outerHTML;
            }
            else{
                document.location.href = "film_info?film=" + selected + "&id=" + getCookie("id");
            }

        }
        if(data.action === "disconnect"){
            document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.location.reload();
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
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.location.reload();
};
socket.onerror = function(error) {
    alert(`[error]` + error.message);
};