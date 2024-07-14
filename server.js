const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Assuming your frontend files are in 'public' folder

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', socket.id);
    });

    socket.on('send-file', ({ file, data }) => {
      // Handle file reception and broadcast to room members
      socket.to(roomId).broadcast.emit('receive-file', { file, data });
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
