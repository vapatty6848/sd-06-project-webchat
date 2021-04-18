const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);
const Messages = require('./models/Messages');

const users = [];

const dateTime = new Date().toLocaleString().replace(/\//g, '-');

const onConnect = async (socket) => {
  // const randomNick = `User-${Math.random().toString(36).substr(2, 16)}`;
  const randomNick = `User-${socket.id.substr(2, 11)}`;
  users.push({ id: socket.id, nickName: randomNick });
  const messages = await Messages.getAllMessages();
  io.emit('nickNameUpdate', users);
  messages.forEach((element) => socket.emit('message',
   `${element.date} - ${element.nickname}: ${element.message}`)); 
};

const nickUpdate = (socket) => {
 socket.on('nickNameUpdate', (nickName) => {
  const currentUser = users.find((usr) => usr.id === socket.id);
  const userIndex = users.indexOf(currentUser);
  users.splice(userIndex, 1, { id: socket.id, nickName });
  io.emit('nickNameUpdate', users);
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
    io.emit('nickNameUpdate', users);
  });
};
io.on('connection', async (socket) => {
  onConnect(socket);
  nickUpdate(socket);
  messageProcess(socket);
  onDisconnect(socket);
});

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen('3000');
