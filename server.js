const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);
const Messages = require('./models/Messages');

const users = [];

const dateTime = new Date().toLocaleString().replace(/\//g, '-');

const onConnect = async (socket) => {
  const randomNick = `User-${Math.random().toString(36).substr(2, 16)}`;
  users.push({ id: socket.id, nickName: randomNick });
  const messages = await Messages.getAllMessages();
  io.emit('nickNameUpdate', users);
  socket.emit('message', messages);
  };
const nickUpdate = (socket) => socket.on('nickNameUpdate', (nickName) => {
  const currentUser = users.find((usr) => usr.id === socket.id);
  const userIndex = users.indexOf(currentUser);
  users.splice(userIndex, 1, { id: socket.id, nickName });
  io.emit('nickNameUpdate', users);
}); 
io.on('connection', async (socket) => {
  onConnect(socket);
  nickUpdate(socket);
   socket.on('message', async (message) => {
    // gravar no banco
    // enviar para o front a lista de mensagens 
    const newMessage = { 
      nickname: message.nickname,
      message: message.chatMessage, 
      date: dateTime,
    };
    await Messages.createMessage(newMessage.nickname, newMessage.message, newMessage.date);
    io.emit('message', [newMessage]);
  });
  socket.on('disconnect', () => {
    const currentUser = users.find((usr) => usr.id === socket.id);
    const userIndex = users.indexOf(currentUser);
    users.splice(userIndex, 1);
    io.emit('nickNameUpdate', users);
  });
});

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen('3000');
