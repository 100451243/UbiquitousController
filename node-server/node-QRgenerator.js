const http = require('http');
var QRCode = require('qrcode');

var fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

let mycode;



const express = require('express');
const app = express();




//
QRCode.toString('https://tv.adelpozoman.es', { type: 'terminal' }, function (err, url) {
  console.log(url);
  const mycode = url;
})

const generateQR = async text => {
  try {
    await QRCode.toFile('node-server/qrcode.png', text)
  }
    catch (err) {
    console.error(err)
    }
}
generateQR('https://tv.adelpozoman.es') //we will call this with different id for different users
//
//
//
//
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   //res.setHeader('Content-Type', 'text/html');
//   html = fs.readFileSync(__dirname + '/indexIntro.html', 'utf8');
//   res.end(html);
// });
//
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
//
//
//
//
//

//
// app.use(express.static(__dirname));
//
// app.get('/', function (req, res) {
//   //res.sendFile(__dirname + 'index.html');
//   QRCode.toDataURL('https://tv.adelpozoman.es', function (err, url) {
//     console.log(url)
//     res.render('index', {qr: url});
//   });
// });
//
// const port2 = 3001;
//
// app.listen(port2, () => {
//   console.log(`Server running at http://localhost:${port2}`);
// });


let redirect = false;


const server3 = app.listen(3002, () => {
    console.log('Server running at http://localhost:3002');
});
app.get('/', (req,res) => {
  if (redirect == false) {
    return res.sendFile(__dirname + '/indexIntro.html');
  }
    else {
      console.log('User is logged in, redirecting to film contents')
      return res.sendFile(__dirname + '/index.html')
  }
});

app.get('/login', (req, res) => {
  console.log('login')
  redirect = true;
  //return res.sendFile(__dirname + '/indexIntro.html');
})


// the following code sends .css and .js files
app.use(express.static(__dirname, {
  extensions: ['htm', 'png', 'jpg', 'jpeg', 'gif', 'css', 'js']
} ));



















