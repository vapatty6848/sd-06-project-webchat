const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);

const users = [];

const dateTime = new Date().toLocaleString().replace(/\//g, '-');

const onConnect = (socket) => {
  const randomNick = `User-${Math.random().toString(36).substr(2, 16)}`;
  users.push({ id: socket.id, nickName: randomNick });
  io.emit('nickNameUpdate', users);
  };

io.on('connection', async (socket) => {
  onConnect(socket);
  socket.on('nickNameUpdate', (nickName) => {
    const currentUser = users.find((usr) => usr.id === socket.id);
    const userIndex = users.indexOf(currentUser);
    users.splice(userIndex, 1, { id: socket.id, nickName });
    io.emit('nickNameUpdate', users);
  }); 
  socket.on('message', (message) => {
    io.emit('message', `${dateTime} - ${message.nickname}: ${message.chatMessage}`);
  });
  socket.on('disconnect', (socket) => {
    const currentUser = users.find((usr) => usr.id === socket.id);
    const userIndex = users.indexOf(currentUser);
    users.splice(userIndex, 1);
    io.emit('nickNameUpdate', users);
  });
});

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen('3000');
