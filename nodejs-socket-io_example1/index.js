const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User is connected');

  // Listen for messages (when user send message this will run)
  socket.on('chat-message', (msg) => {
    console.log('Message:', msg);
    io.emit('chat-message', msg); // Broadcast the message to all connected clients (send message to view)
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User is disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
