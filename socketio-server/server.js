const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    //   origin: "http://localhost:3001",
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg + " tra loi");
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(8765, () => {
  console.log('Socket.io server is running on port 8765');
});
