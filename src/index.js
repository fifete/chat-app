const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const port = process.env.PORT || 3100;
const port2 = process.env.PORT || 3300;
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  },
});

app.use(cors());

// eslint-disable-next-line import/extensions
const client = require('./connection.js');
const db = require('./queries');


// const express = require('express');

// const app = express();

// const port = process.env.PORT || 3300;
// const path = require('path');

// import queries

/* app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});
 */
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
  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg.text);
  });
});

http.listen(port2, () => {
  console.log(`listening on: ${port2}`);
});


/* app.get('/userState', (req, res) => {
  bd.getUserState(false).then((response) => {
    res.send(response);
  });
});

app.post('/addUser', (req, res) => {
  console.log('asks');
  bd.addUser('kitty', 'pam@kity.com', '123456', true)
  res.send('adding kitty');

}); */

/* app.put('/updateState', (req, res) => {
  bd.updateUserState(2, false)
});

app.delete('/deleteUser', (req, res) => {
  bd.deleteUser(4)
}); */

