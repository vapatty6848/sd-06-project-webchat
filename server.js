const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

// obs: add cors depois
const io = require('socket.io')(httpServer);

const users = [];

const dateTime = new Date().toLocaleString().replace(/\//g, '-');

io.on('connection', (socket) => {
  socket.on('nickName', (nickName) => {
    users.splice(0, 0, nickName);
    io.emit('newNickName', users);
  }); 
  socket.on('message', (message) => {
    io.emit('message', `${dateTime} - ${message.nickname}: ${message.chatMessage}`);
  });
});

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen('3000');
