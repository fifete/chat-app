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
const channels = {}
/* 
{
  1: [users]
  cid2: [users del canal 2]
}
 */
io.on('connection', (socket) => {
  socket.on('chat message', (msgInfo) => {
    const { room } = msgInfo;
    io.to(room.name_channel).emit('chat message', msgInfo); // Send to all users in room, including sender
    console.log(room, msgInfo);
  });

  socket.on('general room', (msgInfo) => {
    io.emit('general room', msgInfo);
  });

  socket.on('user registered', (isUserAdded) => {
    io.emit('user registered', isUserAdded);
  });

  socket.on("newUser", data => {
    console.log('🟢: A user Online');
    users.push(data);
    db.updateUserState(data, 'true'); 
    io.emit("newUserResponse", data.email);
  })

  socket.on("reconnect", data => {
    console.log('🟡: user reconnect');
    users.push(data);
    db.updateUserState(data, 'true'); 
    io.emit("newUserResponse", socket.id);
  })

  socket.on('disconnect', () => {
    const presentUser = users.find(user => user.socketID === socket.id);
    console.log('🔥: A user disconnected', presentUser, socket.id);
    db.updateUserState(presentUser, 'false');
    users = users.filter(user =>user.socketID !== socket.id);   
    io.emit("newUserResponse", presentUser.email)
    socket.disconnect()
    // obj {}
  });

  /* 
{
  1: [users]
  cid2: [users del canal 2]
}
 */
  socket.on('joinChannel', (userInChannelInfo) => {
    const { channelInfo, user} = userInChannelInfo
    console.log(channelInfo);
    socket.join(channelInfo.name_channel);
    const {cid} = channelInfo

    if(channels[cid]) {
      // channels[cid] = new Set([...channels[cid]].concat(user))
      channels[cid].forEach(channel => {
        if(channel.email !== user.email){
          channels[cid] = [...channels[cid]].concat(user)
        }
      })
    } 
    else channels[cid] = [].concat(user)
    io.emit("usersInRoom", channels);
    console.log('my', channels);
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