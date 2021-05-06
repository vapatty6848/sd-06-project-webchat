const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);
const Messages = require('./models/Messages');

const users = [];

const dateTime = new Date().toLocaleString().replace(/\//g, '-');

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

// const onConnect = async (socket) => {
//   const { id } = socket;
//   const randomNick = `User-${id.substr(2, 11)}`;
//   users.push({ id, nickName: randomNick });

//   io.emit('nickNameUpdateFront', users);
//   const messages = await Messages.getAllMessages();
//   messages.forEach((message) => socket.emit('message',
//    `${message.date} - ${message.nickname}: ${message.message}`)); 
// };

const nickUpdate = async (nickName, socket) => {
  const currentUser = users.find((usr) => usr.id === socket.id);
  const userIndex = users.indexOf(await currentUser);
  users.splice(userIndex, 1, { id: socket.id, nickName });
  io.emit('nickNameUpdateFront', users); 
};

const messageProcess = async (message) => {
  const { nickname, chatMessage } = message;
  io.emit('message', `${dateTime} - ${nickname}: ${chatMessage}`);
  await Messages.createMessage(nickname, chatMessage, dateTime);
};

const onDisconnect = (socket) => {
  const currentUser = users.find((usr) => usr.id === socket.id);
  const userIndex = users.indexOf(currentUser);
  users.splice(userIndex, 1);
  io.emit('nickNameUpdateFront', users);
};
io.on('connection', async (socket) => {
  const { id } = socket;
  const randomNick = `User-${id.substr(2, 11)}`;
  users.push({ id, nickName: randomNick });

  io.emit('nickNameUpdateFront', users);
  const messages = await Messages.getAllMessages();
  await messages.forEach((message) => socket.emit('message',
   `${message.date} - ${message.nickname}: ${message.message}`)); 

  // onConnect(socket);
  socket.on('nickNameUpdate', (nickName) => nickUpdate(nickName, socket));
  socket.on('message', (message) => messageProcess(message));
  socket.on('disconnect', () => onDisconnect(socket));
});

httpServer.listen('3000');
