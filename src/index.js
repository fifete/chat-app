/* eslint-disable import/newline-after-import */
/* eslint-disable prettier/prettier */
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').Server(app);

const jwt = require('jsonwebtoken');

const port = process.env.PORT || 3100;
const port2 = process.env.PORT || 3300;
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  },
});

const client = require('./connection.js');
const db = require('./queries');
app.use(cors());

// eslint-disable-next-line import/extensions
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname));

client.connect();

app.get('/users', db.getUsers);
app.post('/addUser', db.addUser);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msgInfo) => {
    console.log(msgInfo);
    io.emit('chat message', msgInfo);
  });
});

http.listen(port2, () => {
  console.log(`listening on: ${port2}`);
});

app.post("/login", (req , res) => {
  const infoUserLogin = req.body;
  db.verifyUserLogged(infoUserLogin, res)
});

// Authorization: Bearer <token>
function verifyToken(req, res, next){
  const bearerHeader =  req.headers.authorization;

  if(typeof bearerHeader !== 'undefined'){
       const bearerToken = bearerHeader.split(" ")[1];
       req.token  = bearerToken;
       next();
  }else{
      res.sendStatus(403);
  }
}

app.post("/createCanal", verifyToken, (req , res) => {

  jwt.verify(req.token, 'secretkey', (error, authData) => {
      if(error){
          res.sendStatus(403);
      }else{
          res.json({
                  mensaje: "Canal fue creado",
                  authData
              });
      }
  });
});
