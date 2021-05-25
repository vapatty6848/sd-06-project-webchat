const express = require('express');

const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { 
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const { newMessages, allMessages } = require('./models/messageModel');

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', async (_req, res) => {
  const messageObject = await allMessages();
  const messageList = messageObject
  .map((msg) => `${msg.date} ${msg.nickname} ${msg.chatMessage}`);
  res.render('../views/', { messageList });
});

let allUsers = [];

const newUser = ({ nickname, socket }) => {
  allUsers.push({ id: socket.id, nickname });
  io.emit('updateUsers', allUsers);
};

const handleNickname = ({ newNick, socket }) => {
  const indexUser = allUsers.findIndex((user) => user.id === socket.id);
  allUsers[indexUser].nickname = newNick;
  io.emit('updateUsers', allUsers);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => newUser({ nickname, socket }));

  socket.on('handleNickname', (newNick) => handleNickname({ newNick, socket }));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const formatMessage = moment().format('DD-MM-yyyy HH:mm:ss A'); 
    newMessages({ nickname, chatMessage, date: formatMessage});
    const result = `${formatMessage} - ${nickname} - ${chatMessage}`;
    io.emit('message', result);
  });

  socket.on('disconnect', () => {
    const onUser = allUsers.filter((e) => e.id !== socket.id);
    allUsers = onUser;
    io.emit('updateUsers', allUsers);
  });
});


const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Ouvindo a porta ${PORT}`);
});
