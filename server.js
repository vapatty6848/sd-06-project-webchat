require('dotenv').config();

const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');

const moment = require('moment');

const http = require('http').createServer(app);

const PORT = 3000;
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const { createMessage, getAllMessages } = require('./models/chat');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (_req, res) => {
  const allMessages = await getAllMessages();
  const displayMsg = allMessages
    .map((message) => `${message.timeMessage} ${message.nickname} ${message.chatMessage}`);
  res.render('index', { displayMsg });
});

const usersList = [];

const addNewUser = (socket) => {
  const newUser = {
    id: socket.id,
    nickname: `${Math.random().toString().substr(2, 16)}`,
  };
  usersList.push(newUser);
  return [newUser];
};

const nicknameHandler = (updatedNickname, socket) => {
  const index = usersList.findIndex((user) => user.id === socket.id);
  usersList[index].nickname = updatedNickname;
};

const timestamp = () => {
  const time = moment().format('DD-MM-yyyy HH:mm:ss');
  return time;
};

const messageFormatter = ({ nickname, chatMessage }) => {
  const timeMessage = timestamp();

  createMessage({ nickname, chatMessage, timeMessage });
  const response = `${timeMessage} ${nickname} ${chatMessage}`;
  io.emit('message', response);
};

io.on('connection', (socket) => {
  const newUser = addNewUser(socket);
  io.emit('connected', newUser);
  const onlineUsers = usersList.filter((user) => user.id !== newUser[0].id);
  socket.emit('usersOnline', onlineUsers);

  socket.on('message', async ({ chatMessage, nickname }) => {
    messageFormatter({ nickname, chatMessage });
  });

  socket.on('modifyNickname', ({ updatedNickname }) => {
    nicknameHandler(updatedNickname, socket);
    const userChanged = usersList.find((user) => user.id === socket.id);
    io.emit('modifyNickname', userChanged);
  });

  socket.on('disconnect', () => { 
    const userDisconnected = usersList.findIndex((user) => user.id === socket.id);
    usersList.splice(userDisconnected, 1);
    io.emit('updateOnlineUsers', socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`We are Venom on ${PORT}`);
});
