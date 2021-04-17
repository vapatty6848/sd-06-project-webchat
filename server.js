const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

// obs: add cors depois
const io = require('socket.io')(httpServer);

const users = [];

const dateTime = new Date().toLocaleString().replace(/\//g, '-');

io.on('connection', (socket) => {
  const randomNick = `User-${Math.random().toString(36).substr(2, 16)}`;
  const { id } = socket;
  users.push({ id, nickName: randomNick });
  io.emit('nickNameUpdate', users);

  socket.on('nickNameUpdate', (nickName) => {
    const currentUser = users.find((usr) => usr.id === socket.id);
    const userIndex = users.indexOf(currentUser);
    users.splice(userIndex, 1, { id, nickName });
    io.emit('nickNameUpdate', users);
    console.log(users);
  }); 
  socket.on('message', (message) => {
    io.emit('message', `${dateTime} - ${message.nickname}: ${message.chatMessage}`);
  });
});

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen('3000');
