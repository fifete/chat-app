const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const io = require('socket.io');

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default io;
