const express = require('express');
const app = express();

app.use(express.static(__dirname));

var QRCode = require('qrcode');
QRCode.toString('https://tv.adelpozoman.es', { type: 'terminal' }, function (err, url) {
  console.log(url);
  const mycode = url;
})



app.get('/', function (req, res) {
  res.sendFile(__dirname + 'index.html');
});

app.get('/node-server/scripts.js', function (req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/scripts.js');
});

app.get('/node-server/FFBBDD-6-1.mp4', function (req, res) {
  res.set('Content-Type', 'video/mp4');
    res.sendFile(__dirname + '/FFBBDD-6-1.mp4');
})

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 
