const http = require('http');
let path = require('path');
const QRCode = require('qrcode');
const { v4: uuid, stringify} = require('uuid');
const fs = require('fs');

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const storage = require('node-persist');
storage.init( /* options ... */ );

const hostname = '192.168.68.138';
const port = 3000;

const dhtml = "/display-html";


const createFilmList = require('./film-discovery.js');





const generateQR = async text => {        //we will call this with different id for different users
  try {
    await QRCode.toFile(__dirname +'qrcode.png', text)
  } catch (err) {console.error(err)}
}


//users = {};

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
    generateQR(hostname + '?id=' + id + '&mobile=true')
    return res.sendFile(__dirname + dhtml + '/indexIntro.html');
  } else if (await storage.getItem(id) == "false") {
    console.log("User has yet to login with id %s", id)
    generateQR(hostname + '?id=' + id + '&mobile=true')
    return res.sendFile(__dirname + dhtml + '/indexIntro.html');
  } else if (await storage.getItem(id) == "true") {
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
  console.log('login of user with id %s', id)
  //broadcast to all clients
    wss.clients.forEach(function each(client) {
        if (client !== wss && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({action: "reload", id: id}));
            console.log("sent reload to client")
        }
    });
    let path2 = path.join(__dirname, '..', 'mobile', 'mobile.html');
  return res.sendFile(path2);
})

app.get('/touch_actions.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'touch_actions.js');
  return res.sendFile(path2);
})

app.get('/animations.js', async (req, res) => {
  let path2 = path.join(__dirname, '..', 'mobile', 'animations.js');
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
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('Received message: %s', message);
    try {
      const data = JSON.parse(message);
      if(data.action === "login") {
        // today this will be implemented, I need to access mobile js file
        //broadcast to all clients
        // wss.clients.forEach(function each(client) {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     client.send(JSON.stringify({action: "reload", id: data.id}));
        //   }
        // });
      }
      if(data.action === "requestFilms"){
        console.log("Will send films")
        let films = createFilmList("filmsLink");
        ws.send(JSON.stringify({action: "films", films: films}));
      }
      if(data.action === "requestInstructions"){
        console.log("Will send films")
        //let films = createFilmList("filmsLink");
        ws.send(JSON.stringify({action: "instructions", films: "Esto serían las instrucciones, funcionara?"}));
      }
    }
    catch (e) {
      console.log("")
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
  });
  ws.on('error', function close() {
    console.log('Client disconnected');
  });

});


















