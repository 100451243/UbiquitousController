const http = require('http');
let path = require('path');
const QRCode = require('qrcode');
const { v4: uuid, stringify} = require('uuid');
const fs = require('fs');

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const createFilmList = require('./modules/film-discovery.js');
const srt2webvtt = require('./modules/srt2webvtt.js');

const storage = require('node-persist');
storage.init( /* options ... */ );

if (process.argv.length !== 4){
  console.log("Usage: node app.js <port> <path-to-movies>");
  process.exit(1);
}

const port = process.argv[2];
const library_path = process.argv[3];

const dhtml = "/display-html";

actions = ["zoom_out", "zoom_in", "left-swipe", "right-swipe", "up-swipe", "down-swipe", "tap", "double-tap", "knob", "portrait", "shake", "info"]
displays = {}
phones = {}

const generateQR = async text => {        //we will call this with different id for different users
  try {
    await QRCode.toFile(__dirname +'/media/qrcode.png', text)
  } catch (err) {console.error(err)}
}


const server3 = app.listen(port, () => {
    console.log('Server running at local port: ' + port + '/');
});
app.get('/', async (req, res) => {
  let id = req.cookies['id'];
  // Get the host and port from the request object
  const [hostname, port] = req.get('host').split(':');
  if (id === undefined) {
    console.log(id);
    //users[id = uuid().slice(0, 8)] = "false";
    storage.setItem(id = uuid().slice(0, 8), 'false')
    console.log('First visit of user, given id is: ' + id)
    res.cookie('id', id);
    await generateQR(req.protocol + "://" + hostname + (port ? ':' + port : '') + '/login?id=' + id + '&mobile=true')
    return res.sendFile(__dirname + dhtml + '/indexIntro.html');
  } else if (await storage.getItem(id) === "false") {
    console.log("User has yet to login with id %s", id)
    await generateQR(req.protocol + "://" + hostname + (port ? ':' + port : '') + '/login?id=' + id + '&mobile=true')
    return res.sendFile(__dirname + dhtml + '/indexIntro.html');
  } else if (await storage.getItem(id) === "true") {
    console.log('User is logged in with id %s, redirecting to film contents', id)
    res.cookie('id', id)
    res.cookie('SameSite', 'None')
    return res.sendFile(__dirname + dhtml + '/index.html')
  } else {
    console.log('Undefined behaviour');
    console.log(storage.getItem(id));
    storage.setItem(id = uuid().slice(0, 8), 'false')
    console.log('First visit of user, given id is: ' + id)
    res.cookie('id', id);
    return res.sendFile(__dirname + dhtml + '/indexIntro.html');
  }
});

app.get('/login', async (req, res) => {
  const id = req.query.id;
  await storage.setItem(id, 'true')
  console.log('Login page accesed with id %s', id)
  res.cookie('id', id)
  return res.sendFile(path.join(__dirname, 'mobile', 'mobile.html'));
})

app.get('/film_info', async (req, res) => {
  if(req.query.id !== req.cookies['id']) {
    console.log("No id given on film page, redirecting to login page")
    res.redirect('/');
  }
  console.log("redirected to film_info page")
  return res.sendFile(path.join(__dirname, dhtml, 'film_info.html'));
});

app.use('/movies', express.static(library_path));

app.get('/touch_actions.js', async (req, res) => {
  let path2 = path.join(__dirname, 'mobile', 'touch_actions.js');
  return res.sendFile(path2);
})

app.get('/animations.js', async (req, res) => {
  let path2 = path.join(__dirname, 'mobile', 'animations.js');
  return res.sendFile(path2);
})

app.get('/mobile.css', async (req, res) => {
  let path2 = path.join(__dirname, 'mobile', 'mobile.css');
  return res.sendFile(path2);
})

app.get('/pureknob.js', async (req, res) => {
  let path2 = path.join(__dirname, 'mobile', 'pureknob.js');
  return res.sendFile(path2);
})

app.get('/movement_actions.js', async (req, res) => {
  let path2 = path.join(__dirname, 'mobile', 'movement_actions.js');
  return res.sendFile(path2);
})

app.get('/communication.js', async (req, res) => {
  let path2 = path.join(__dirname, 'mobile', 'communication.js');
  return res.sendFile(path2);
})
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
  console.log('Websockets Client has connected:');
  let id;

  ws.on('message', function incoming(message) {
    console.log('Received message: %s', message);
    try {
      const data = JSON.parse(message);
      switch (data.action) {
        case "waitLogin": //this is waiting on the display
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
          break;
        case "validated": //this is the login from the mobile
          id = data.id;
          ws.id = "phone" + id;
          if (phones[id] == undefined) { //check if phones[id] exists
            phones[id] = ws;
            console.log("Added phone with id %s", id)
          }  //else check if corresponding display exists, if not maybe send disconnect
          wss.clients.forEach(function each(client) {
            if (client.id === id) {
              client.send(JSON.stringify({action: "reload", id: id}));
            }
          });
          break;
        case "requestFilms":
          id = data.id;
          ws.id = id;
          //check if displays[id] exists
          if (displays[id] == undefined) {
            displays[id] = ws;
            console.log("Added display with id %s. ATTENTION THIS SHOULD NOT HAPPEN", id);}
          if (phones[id] == undefined) {
            console.log("Phone with id %s not found. ATTENTION THIS SHOULD NOT HAPPEN", id)
            storage.setItem(id, "false");
            ws.send(JSON.stringify({action: "disconnect", id: data.id}));}
          console.log("Will send films to logged in user")
          ws.send(JSON.stringify({action: "films", films: createFilmList(library_path)}));
          break;
        case "requestFilmsBeforeLogin":
          ws.send(JSON.stringify({action: "filmsInfo", films: createFilmList(library_path)}));
          break;
        case "info":
          console.log("Phone requested info to server, server asks display for info")
          wss.clients.forEach(function each(client) {
            if (client.id === data.id) {
              client.send(JSON.stringify({action: "infoRequestToDisplay", id: data.id}));
            }
          });
          break;
        case "infoResponse":
          console.log("Display sent info to server, server sends info to phone")
          wss.clients.forEach(function each(client) {
            if (client.id === "phone" + data.id) {
              client.send(JSON.stringify({action: "infoResponseToPhone", id: data.id, context: data.context}));
            }
          });
          break;
        case "close-video":
          wss.clients.forEach(function each(client) {
            if (client.id == data.id) {
              client.send(JSON.stringify({action: "shake", id: data.id}));
            }
          });
          break;
        case "disconnect":
          console.log("Disconnected successfully")  //this is never reached, neither from phone nor from display
          storage.setItem(id, "false");
          displays.data.id.send(JSON.stringify({action: "disconnect", id: data.id}));
          delete phones[id];
          break;
        case "convert":
          console.log("Will convert subtitles")
          let subs_path = path.join(library_path, data.path);
          let srt_data = fs.readFileSync(subs_path);
          let newExtension = subs_path.slice(0, -3) + "vtt";

          let vtt;
          try {
            vtt = srt2webvtt(srt_data.toString());
          } catch (err) {
            console.log("Error converting subtitles: %s", err);
          }
          try {
            fs.writeFileSync(newExtension, vtt);
          } catch {
            console.log("Error writing subtitles to file, could be there already")
          }
          console.log("Subtitles converted")
          ws.send(JSON.stringify({action: "subtitleReady"}));
          break;
        case "filter":
          wss.clients.forEach(function each(client) {
              if (client.id == data.id) {
              client.send(JSON.stringify({action: "filter", id: data.id, filter: data.filter}));
              }
          });
          break;
        case "noResultsFilter":
          wss.clients.forEach(function each(client) {
              if (client.id === "phone" + data.id) {
              client.send(JSON.stringify({action: "noResultsFilter", id: data.id, filter: data.filter}));
              }
          });
          break;
        default:
          let string = data.action;
          actions.forEach(function (item, index) {
            if (string.includes(item)) {
              if (displays[data.id] !== undefined) {
                let sendTo = displays[data.id]
                sendTo.send(JSON.stringify({action: item, id: data.id}));
                //console.log("Move detected: %s" + item + " Sent action " + item + " to display with id " + data.id)
              } else {  console.log("Display with id %s not found", data.id) }
              wss.clients.forEach(function each(client) {
                if (client.id == data.id) {
                  if(data.value === undefined){  //not-knob vs knob action
                    client.send(JSON.stringify({action: item, id: data.id}));
                  }else{client.send(JSON.stringify({action: item, id: data.id, value: data.value}));}

                }
              });
            }
          });
      }


    }
    catch (e) {
      console.log("")
    }
  });

  ws.on('close', function close() {
    clearInterval(pingInterval);
    console.log('Client %s disconnected on close', ws.id);
    if(ws.id !== undefined) {
      if (ws.id.includes("phone")) {
        if(id!==undefined) { //fix server crash when phone disconnects without id
          console.log("Phone with id %s disconnected", id)
          delete phones[id];
          storage.setItem(id, "false");
          //console.log(id.split("phone-")[1])
          wss.clients.forEach(function each(client) {
            if (client.id == id) {
              client.send(JSON.stringify({action: "disconnect", id: id}));
              delete displays[id];
            }
          });
        }
      } else { console.log("Display with id %s disconnected", ws.id) }
    }else{console.log("Undefined id websocket has disconnected");}
  });
  ws.on('error', function close() {
    console.log('Client disconnected on error');
  });

});

const pingInterval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({type: 'ping'}));
    }
  });
}, 30000);

