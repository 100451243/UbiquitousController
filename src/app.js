const http = require('http');
const QRCode = require('qrcode');
const { v4: uuid, stringify} = require('uuid');
const fs = require('fs');

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const storage = require('node-persist');
storage.init( /* options ... */ );

const hostname = '127.0.0.1';
const port = 3000;

const dhtml = "/display-html";



const generateQR = async text => {        //we will call this with different id for different users
  try {
    await QRCode.toFile(__dirname +'qrcode.png', text)
  }
    catch (err) {
    console.error(err)
    }
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
  //users[id] = "true";
  //return res.sendFile(__dirname + '/indexIntro.html');
})


// the following code sends .css and .js files
app.use(express.static(__dirname, {
  extensions: ['htm', 'png', 'jpg', 'jpeg', 'gif', 'css', 'js']
} ));



















