const http = require('http');
var QRCode = require('qrcode');
const express = require('express');

const hostname = '127.0.0.1';
const port = 3000;


QRCode.toString('I am a pony!', { type: 'terminal' }, function (err, url) {
  console.log(url);
  const mycode = url;
})


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  /* QRCode.toString('https://tv.adelpozoman.es', { type: 'terminal' }, function (err, url) {
    if (err) {
      res.end('Error generating QR code');
    } else {
      res.end(url.toString());
      //res.end(mycode)
      //code to show the QR code in the browser
      //res.end('<img src="' + url + '" />');

    }
  }); */
  //load index.html file and show it
  const express = require('express');
  const app = express();

  app.get('/', function (request, response) {
    res.sendFile('index.html');
  });



});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


QRCode.toString('I am a pony!', { type: 'terminal' }, function (err, url) {
  console.log(url);
})



