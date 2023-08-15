const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Keep track of connected users and their rooms
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user joining a room
  socket.on('join', (username, room) => {
    socket.join(room);
    users[socket.id] = { username, room };
    socket.to(room).emit('system message', `${username} has joined the room`);
  });

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('chat message', { username: user.username, message: msg });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('system message', `${user.username} has left the room`);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
