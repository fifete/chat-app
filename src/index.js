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
app.get('/channels', db.getChannels);
app.post('/channelByName', db.channelByName);
app.post('/userRow', db.getUserRow);
app.post('/addUserToChannel', db.addUserToChannel);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/addUser', db.addUser);

let users = [];

io.on('connection', (socket) => {
  socket.on('chat message', (msgInfo) => {
    io.emit('chat message', msgInfo);
  });

  socket.on('user registered', (isUserAdded) => {
    io.emit('user registered', isUserAdded);
  });

  socket.on("newUser", data => {
    console.log('🔥: A user Online');
    users.push(data);
    db.updateUserState(data, 'true'); 
    io.emit("newUserResponse", data.email);
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    const presentUser = users.find(user => user.socketID === socket.id);
    db.updateUserState(presentUser, 'false');
    users = users.filter(user =>user.socketID !== socket.id);   
    io.emit("newUserResponse", presentUser.email)
    socket.disconnect()
  });

  socket.on('joinChannel', (channel) => {
    console.log(channel);
    socket.join(channel);
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
      res.sendStatus(403).send();
  }
}
// app.post('/addChannel', db.addChannel);
app.post("/addChannel", verifyToken, db.addChannel);