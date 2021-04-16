const express = require('express');
const dateFormat = require('dateformat');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
  res.render('home');
});

let users = [];
const date = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss TT');

// eslint-disable-next-line max-lines-per-function
io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    const userExists = users.find((user) => user.socketId === socket.id);
    if (userExists) {
      userExists.name = nickname;
      io.emit('updateUsers', users);
      io.emit('logStatus', `Usuário ${nickname} conectou`);
      console.log('users do meu newUserExists', users);
      return;
    }

    users.push({ socketId: socket.id, name: nickname });

    io.emit('updateUsers', users);
    io.emit('logStatus', `Usuário ${nickname} conectou`);
    console.log('users do meu updateUsers', users);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    console.log('users do meu Message', users);
  });

  socket.on('logStatus', (logStatus) => {
    io.emit('logStatus', logStatus);
    console.log('users do meu logStatus', users);
  });

  socket.on('disconnect', () => {
    const disconnectingUser = users.find((user) => user.socketId === socket.id);
    if (disconnectingUser) {
      io.emit('logStatus', `Usuário ${disconnectingUser.name} desconectou`);
      console.log('users do meu disconectEXISTS', users);
    }
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('updateUsers', users);
    console.log('users do meu disconnect', users);
  });
});

httpServer.listen('3000');
