const express = require('express');

const app = express();
const HTTP = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const io = require('socket.io')(HTTP, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { newMessages, allMessages } = require('./models/messages');

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', async (_req, res) => {
  const messageObject = await allMessages();
  const messageList = messageObject.map((msg) => `${msg.date} ${msg.nickname} ${msg.chatMessage}`);
  res.render('../views/', { messageList });
  // console.log(messageObject);
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
    const messageDate = moment().format('DD-MM-yyyy HH:mm:ss a'); // DD-MM-yyyy HH:mm:ss
    newMessages({ nickname, chatMessage, date: messageDate });
    const result = `${messageDate} - ${nickname} - ${chatMessage}`;
    io.emit('message', result);
  });

  socket.on('disconnect', () => {
    const onUser = allUsers.filter((e) => e.id !== socket.id);
    allUsers = onUser;
    io.emit('updateUsers', allUsers);
  });
});

HTTP.listen(3000, () => {
  console.log('O pai ta ON na 3000');
});