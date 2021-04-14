const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

// obs: add cors mais tarde
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = [];

io.on('connection', (socket) => {
  // console.log(`usuário novo conectado ${socket.id}`);
  socket.on('newUser', (user) => {
    users.push({ socketId: socket.id, name: user });
    
    io.emit('updateUsers', users);

    socket.broadcast.emit('newMessage', `Usuário ${socket.id} conectou`);
  });

  socket.on('message', (message) => {
    console.log(message);
    io.emit('newMessage', message);
  });

  // deconcção do usuário
  socket.on('disconnect', () => {
    // console.log(`Usuário ${socket.id} desconectou`);
    io.emit('newMessage', `Usuário ${socket.id} desconectou`);

    const userIndex = users.findIndex((u) => u.socketId === socket.id);
    if (userIndex > 0) {
      users.splice(userIndex, 1);
      io.emit('updateUsers', users);
    }
  });
});

app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen('3000');
