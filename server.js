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

const messagesModel = require('./models/messages');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views/');

app.get('/', (_req, res) => {
  res.render('index');
});

let users = [];
const timestamp = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss TT');

const newUser = (nickname, socket) => {
  const userExists = users.find((user) => user.socketId === socket.id);
  if (userExists) {
    userExists.name = nickname;
    io.emit('updateUsers', users);
    io.emit('logStatus', `Usuário ${nickname} conectou`);
    return;
  }
  
  users.push({ socketId: socket.id, name: nickname });
  
  io.emit('updateUsers', users);
  io.emit('logStatus', `Usuário ${nickname} conectou`);
};

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => newUser(nickname, socket));

  socket.on('message', async ({ chatMessage, nickname }) => {
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
    await messagesModel.create(chatMessage, nickname, timestamp);
  });

  socket.on('logStatus', (logStatus) => {
    io.emit('logStatus', logStatus);
  });

  socket.on('disconnect', () => {
    const userExists = users.find((user) => user.socketId === socket.id);
    if (userExists) {
      io.emit('logStatus', `Usuário ${userExists.name} desconectou`);
    }
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('updateUsers', users);
  });
});

httpServer.listen('3000');
