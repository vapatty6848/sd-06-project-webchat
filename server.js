const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const moment = require('moment');
const { newMessage, renderMessages } = require('./models/message');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './view');

let arrayUsers = [];

app.get('/', async (_req, res) => {
  const getAllMessages = await renderMessages();
  const messages = getAllMessages.map(
    (message) => `${message.time} ${message.nickname} ${message.message}`,
  );
  res.render('home', { messages }); 
});

const messageFormat = async ({ chatMessage, nickname }) => {
  const time = moment().format('DD-MM-YYYY HH:mm:ss A');
  const message = `${time} ${nickname} ${chatMessage}`;
  await newMessage(time, nickname, chatMessage);
  io.emit('message', message);
};

io.on('connection', (socket) => {
  console.log(`New user ${socket.id} connected.`);

  socket.on('message', (message) => messageFormat(message));

  socket.on('connectedUser', (nickname) => {
    arrayUsers.push({ id: socket.id, nickname });
    io.emit('nickname', arrayUsers);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected.`);
    const userOnline = arrayUsers.filter((user) => user.id !== socket.id);
    arrayUsers = userOnline;
    io.emit('nickname', arrayUsers);
  });

  socket.on('updatedUser', (newNickname) => {
    const userOnChat = arrayUsers.find((user) => user.id === socket.id);
    userOnChat.nickname = newNickname;
    arrayUsers = arrayUsers.map((user) => (user.id === socket.id ? userOnChat : user));
    io.emit('nickname', arrayUsers);
  });
});
httpServer.listen(PORT, () => console.log(`on PORT ${PORT}`));
