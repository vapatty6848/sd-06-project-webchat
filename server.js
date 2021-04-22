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
  messages.forEach((element) => socket.emit('message',
   `${element.date} - ${element.nickname}: ${element.message}`)); 
};

const nickUpdate = async (socket) => {
 socket.on('nickNameUpdate', (nickName) => {
  const currentUser = users.find((usr) => usr.id === socket.id);
  const userIndex = users.indexOf(currentUser);
  users.splice(userIndex, 1, { id: socket.id, nickName });
  io.emit('nickNameUpdateFront', users);
  }); 
};

const messageProcess = async (socket) => {
  socket.on('message', async (message) => {
    const { nickname, chatMessage } = message;
    await Messages.createMessage(nickname, chatMessage, dateTime);
    io.emit('message', `${dateTime} - ${nickname}: ${chatMessage}`);
  });
};

const onDisconnect = async (socket) => {
  socket.on('disconnect', () => {
    const currentUser = users.find((usr) => usr.id === socket.id);
    const userIndex = users.indexOf(currentUser);
    users.splice(userIndex, 1);
    io.emit('nickNameUpdateFront', users);
    console.log('entrei no onDisconnect');
    console.log(users);
  });
};
io.on('connection', async (socket) => {
  await onConnect(socket);
  await nickUpdate(socket);
  await messageProcess(socket);
  await onDisconnect(socket);
});

httpServer.listen('3000');
