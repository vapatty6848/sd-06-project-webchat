require('dotenv').config();
const moment = require('moment');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const chatController = require('./controller/messageController');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views ')));
app.set('view engine', 'ejs');
app.set('views', './views');

let users = [];
const date = moment().format('DD-MM-yyyy HH:mm:ss');
 const socketNick = (nick, socket) => {
  const nickname = nick;
  console.log(nickname, 'nick aqui');
  const user = { nickname, id: socket.id };
  users.push(user);
  console.log(users);
  io.emit('nickUser', users);
 };

const socketUpdatedNick = (updatedUser, socket) => {
  const indexUser = users.findIndex((user) => user.id === socket.id);
  users.splice(indexUser, 1, updatedUser);
  console.log(users);
  io.emit('nickUser', users);
};

io.on('connection', async (socket) => {
  socket.on('disconnect', () => {
    const newListUser = users.filter((user) => user.id !== socket.id);
    users = newListUser;
    io.emit('nickUser', newListUser);
  });
  socket.on('message', async (message) => {
    const formatedMessage = chatController.formatMsg(date, message.nickname, message.chatMessage);
    chatController.insertMessage(date, message.nickname, message.chatMessage);
    io.emit('message', formatedMessage);
  });

  // socket.on('user', (nick) => {
  //   const user = { nickname: nick || socket.id.slice(0, 16), id: socket.id };
  //   users.push(user);
  //   io.emit('nickUser', users);
  // });
  socket.on('updatedUser', (updatedUser) => socketUpdatedNick(updatedUser, socket));

  socket.on('user', () => {
    socketNick(socket.id.slice(0, 16), socket);
  });
  // io.emit('updatedUser', `${socket.id} acabou de entrar`);
});

app.get('/', chatController.getMessage);

app.post('/', chatController.insertMessage);

http.listen(PORT, () => console.log(`webchat port: ${PORT}!`));