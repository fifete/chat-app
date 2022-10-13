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
const { log } = require('console');
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
app.post('/userName', db.getUserName);
app.post('/addChannel', db.addChannel);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/addUser', db.addUser);

let users = [];

io.on('connection', (socket) => {
  // const statusBoolean = true
  socket.on('chat message', (msgInfo) => {
    console.log(msgInfo);
    io.emit('chat message', msgInfo);
  });
  socket.on("newUser", data => {
    console.log('dataserver55', data);
    console.log('🔥: A user Online');
    users.push(data);
    db.test(data, 'true'); 
      // userRow.status = 'Online'
    io.emit("newUserResponse", users);
  })
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    const presentUser = users.find(user => user.socketID === socket.id);
    db.test(presentUser, 'false');
    console.log('usuario que se va', presentUser);
    users = users.filter(user =>user.socketID !== socket.id);
/*     const userIndex = users.indexOf(socket)
    console.log(userIndex);  */   
    io.emit("newUserResponse", users)
    socket.disconnect()
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
