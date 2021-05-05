const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);
const Messages = require('./models/Messages');

const users = [];

const dateTime = new Date().toLocaleString().replace(/\//g, '-');

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

const onConnect = async (socket) => {
  console.log('entrei no onConnect');
  const { id } = socket;
  const randomNick = `User-${id.substr(2, 11)}`;
  users.push({ id, nickName: randomNick });
  console.log('users: ', users);

  io.emit('nickNameUpdateFront', users);
  const messages = await Messages.getAllMessages();
  messages.forEach((message) => socket.emit('message',
   `${message.date} - ${message.nickname}: ${message.message}`)); 
};

const nickUpdate = async (nickName, socket) => {
  console.log('entrei no nickUpdate');
  const currentUser = users.find((usr) => usr.id === socket.id);
  const userIndex = users.indexOf(currentUser);
  users.splice(userIndex, 1, { id: socket.id, nickName });
  io.emit('nickNameUpdateFront', users); 
};

const messageProcess = async (socket, message) => {
  console.log('entrei no messageProcess');

  const { nickname, chatMessage } = message;
  io.emit('message', `${dateTime} - ${nickname}: ${chatMessage}`);
  Messages.createMessage(nickname, chatMessage, dateTime);
};

const onDisconnect = async (socket) => {
  const currentUser = users.find((usr) => usr.id === socket.id);
  const userIndex = users.indexOf(currentUser);
  users.splice(userIndex, 1);
  io.emit('nickNameUpdateFront', users);
  console.log('entrei no onDisconnect');
  console.log(users);
};
io.on('connection', async (socket) => {
  await onConnect(socket);
  socket.on('nickNameUpdate', (nickName) => nickUpdate(nickName, socket));
  socket.on('message', async (message) => messageProcess(socket, message));
  socket.on('disconnect', () => onDisconnect(socket));
});

httpServer.listen('3000');
