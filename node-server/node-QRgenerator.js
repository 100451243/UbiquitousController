const http = require('http');
var QRCode = require('qrcode');

var fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

let mycode;

QRCode.toString('https://tv.adelpozoman.es', { type: 'terminal' }, function (err, url) {
  console.log(url);
  const mycode = url;
})

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  html = fs.readFileSync(__dirname + '/index.html', 'utf8');
  res.end(html);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});





const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'index.html');
});

const port2 = 3001;

app.listen(port2, () => {
  console.log(`Server running at http://localhost:${port2}`);
});
