const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  io.emit('a user connected');
  socket.on('disconnect', () => {
    io.emit('a user disconnected');
  });
  socket.on('chat message', (message) => {
    socket.broadcast.emit('chat message', {
      message: message.value,
      user: message.user,
    });
  });

  socket.on('user is typing', ({ user, typing }) => {
    socket.broadcast.emit('user is typing', {
      user: user,
      typing: typing,
    });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
