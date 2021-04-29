const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const moment = require('moment');
const { createMessage, getAllMessages } = require('./models/messageModel');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './view');

let arrayUsers = [];

app.get('/', async (_req, res) => {
  const allMessages = await getAllMessages();
  console.log('allmessages:', allMessages);
  const messages = allMessages.map(
    (message) => `${message.time} ${message.nickname} ${message.message}`,
  );
  res.render('home', { messages }); 
});

const formatMessage = async ({ chatMessage, nickname }) => {
  const time = moment().format('DD-MM-YYYY HH:mm:ss A');
  const message = `${time} ${nickname} ${chatMessage}`;
  await createMessage(time, nickname, chatMessage);
  io.emit('message', message);
};

io.on('connection', (socket) => {
  // console.log(`Novo usuário conectado: ${socket.id}`);
  
  socket.on('message', (message) => formatMessage(message));

  socket.on('connectedUser', (nickname) => {
    arrayUsers.push({ id: socket.id, nickname });
    io.emit('nickname', arrayUsers);
  });

  socket.on('updatedUser', (newNickname) => {
    const chatUser = arrayUsers.find((user) => user.id === socket.id);
    chatUser.nickname = newNickname;
    arrayUsers = arrayUsers.map((user) => (user.id === socket.id ? chatUser : user));
    io.emit('nickname', arrayUsers);
  });

  socket.on('disconnect', () => {
    console.log(`Usuário ${socket.id} desconectado`);
    const onlineUsers = arrayUsers.filter((user) => user.id !== socket.id);
    arrayUsers = onlineUsers;
    io.emit('nickname', arrayUsers);
  });
});
httpServer.listen(PORT, () => console.log(`on PORT ${PORT}`));
