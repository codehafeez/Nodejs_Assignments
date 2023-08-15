const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const sessionMiddleware = session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

app.get('/', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const username = req.body.username;
  req.session.username = username;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

const users = {};

io.use(sharedSession(sessionMiddleware)); // Use shared session for Socket.IO

io.on('connection', (socket) => {
  console.log('A user connected');

  if (socket.handshake.session.username) {
    const username = socket.handshake.session.username;
    users[socket.id] = { username };
    socket.emit('system message', `Welcome, ${username}!`);
  }

  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    if (user) {
      io.emit('chat message', { username: user.username, message: msg });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const user = users[socket.id];
    if (user) {
      io.emit('system message', `${user.username} has left the chat`);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
