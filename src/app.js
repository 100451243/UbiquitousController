const http = require('http');
let path = require('path');
const QRCode = require('qrcode');
const { v4: uuid, stringify} = require('uuid');
const fs = require('fs');

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const createFilmList = require('./film-discovery.js');

const storage = require('node-persist');
storage.init( /* options ... */ );

const hostname = process.env.PHOSTNAME || "localhost";
const port = process.env.PORT || 3000;
const library_path = process.env.LIBRARY_PATH || "filmsLink";

const dhtml = "/display-html";

actions = ["zoom_out", "zoom_in", "left-swipe", "right-swipe", "up-swipe", "down-swipe", "tap", "double-tap", "info"]
displays = {}
phones = {}

const generateQR = async text => {        //we will call this with different id for different users
  try {
    await QRCode.toFile(__dirname +'/qrcode.png', text)
  } catch (err) {console.error(err)}
}


const server3 = app.listen(port, hostname, () => {
    console.log('Server running at http://' + hostname + ':' + port + '/');
});
app.get('/', async (req, res) => {
  let id = req.cookies['id'];
  if (id === undefined) {
    console.log(id)
    //users[id = uuid().slice(0, 8)] = "false";
    storage.setItem(id = uuid().slice(0, 8), 'false')
    console.log('First visit of user, given id is: ' + id)
    res.cookie('id', id);
    await generateQR("http://" + hostname + ':' + port + '/login?id=' + id + '&mobile=true')
    return res.sendFile(__dirname + dhtml + '/indexIntro.html');
  } else if (await storage.getItem(id) === "false") {
    console.log("User has yet to login with id %s", id)
    await generateQR("http://" + hostname + ':' + port+ '/login?id=' + id + '&mobile=true')
    return res.sendFile(__dirname + dhtml + '/indexIntro.html');
  } else if (await storage.getItem(id) === "true") {
    console.log('User is logged in with id %s, redirecting to film contents', id)
    res.cookie('id', id)
    res.cookie('SameSite', 'None')
    return res.sendFile(__dirname + dhtml + '/index.html')
  } else {
    console.log('Undefined behaviour');
    console.log(storage.getItem(id));
  }
});

app.get('/login', async (req, res) => {
  const id = req.query.id;
  await storage.setItem(id, 'true')
  console.log('Login page accesed with id %s', id)
  res.cookie('id', id)
  return res.sendFile(path.join(__dirname, '..', 'mobile', 'mobile.html'));
})

app.get('/touch_actions.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'touch_actions.js');
  return res.sendFile(path2);
})

app.get('/animations.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'animations.js');
  return res.sendFile(path2);
})

app.get('/communication.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'communication.js');
  return res.sendFile(path2);
})

app.get('/mobile.css', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'mobile.css');
  return res.sendFile(path2);
})

app.get('/pureknob.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'pureknob.js');
  return res.sendFile(path2);
})

app.get('/movement_actions.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'movement_actions.js');
  return res.sendFile(path2);
})

app.get('/communication.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'communication.js');
  return res.sendFile(path2);
})
// the following code sends .css and .js files
// the following code sends .css and .js files
// the following code sends .css and .js files
app.use(express.static(__dirname, {
  extensions: ['htm', 'png', 'jpg', 'jpeg', 'gif', 'css', 'js']
} ));




const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 });
// new method allows to use the same port as the server, which is nice, but I don't understand why it works
const {Server} = require('ws');
const wss = new Server({server: server3});


wss.on('connection', function connection(ws, req) {
  console.log('Websockets Client connected:');
  let id;

  ws.on('message', function incoming(message) {
    console.log('Received message: %s', message);
    try {
      const data = JSON.parse(message);
      if(data.action === "waitLogin") {  //this is waiting on the display
        id = data.id;
        ws.id = id;
        //check if displays[id] exists
        if (displays[id] == undefined) {
          displays[id] = ws;
          console.log("Added display with id %s", id)
        }
        if (storage.getItem(id) === "true") {
          ws.send(JSON.stringify({action: "reload", id: id}));  //not sure bout this
        }
      }
      if(data.action === "validated") {  //this is the login from the mobile
        id = data.id;
        ws.id = "phone" + id;
        //check if phones[id] exists
        if (phones[id] == undefined) {
          phones[id] = ws;
          console.log("Added phone with id %s", id)
        }  //else check if corresponding display exists, if not maybe send disconnect
        wss.clients.forEach(function each(client) {
          if (client.id === id) {
            client.send(JSON.stringify({action: "reload", id: id}));
          }
        });
      }
      if(data.action === "requestFilms"){
        id = data.id;
        ws.id = id;
        //check if displays[id] exists
        if (displays[id] == undefined) {
          displays[id] = ws;
          console.log("Added display with id %s. ATTENTION THIS SHOULD NOT HAPPEN", id)
        }
        if (phones[id] == undefined) {
          storage.setItem(id, "false");
          ws.send(JSON.stringify({action: "disconnect", id: data.id}));
        }
        console.log("Will send films")
        let films = createFilmList(library_path);
        ws.send(JSON.stringify({action: "films", films: films}));
      }
      if(data.action === "info"){
        console.log("Will send films")
        //let films = createFilmList("filmsLink");
        ws.send(JSON.stringify({action: "instructions", films: "Esto serían las instrucciones, funcionara?"}));
      }
      if(data.action === "disconnect"){
        console.log("Disconnected successfully")  //this is never reached, neither from phone nor from display
        storage.setItem(id, "false");
        displays.data.id.send(JSON.stringify({action: "disconnect", id: data.id}));
        delete phones[id];
      }


      let string = data.action;
      actions.forEach(function (item, index) {
        if (string.includes(item)) {
          if (displays[data.id] !== undefined) {
            let sender = displays[data.id]
            sender.send(JSON.stringify({action: item, id: data.id}));
            console.log("Action detected: %s" + item + " Sent action " + item + " to display with id " + data.id)
          } else {  console.log("Display with id %s not found", data.id) }
          wss.clients.forEach(function each(client) {
            if (client.id == data.id) {
              client.send(JSON.stringify({action: item, id: data.id}));
            }
          });
        }
      });


    }
    catch (e) {
      console.log("")
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected on close');
    if (ws.id.includes("phone")) {
      console.log("Phone with id %s disconnected", id)
      delete phones[id];
      storage.setItem(id, "false");
      //console.log(id.split("phone-")[1])
      wss.clients.forEach(function each(client) {
        if (client.id == id) {
          client.send(JSON.stringify({action: "disconnect", id: id}));
          delete displays[id];
          delete phones[id];
        }
      });
    }
  });
  ws.on('error', function close() {
    console.log('Client disconnected on error');
  });

});


















