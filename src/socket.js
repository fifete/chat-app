/* eslint-disable prettier/prettier */
// realtime chat app usign socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
console.log(__dirname);
app.use(express.static(__dirname));
io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});
console.log('connected');