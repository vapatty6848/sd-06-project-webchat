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

const { getAllMessages, createMessage } = require('./models/chat');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (_req, res) => {
  const allMessages = await getAllMessages();
  const renderMessages = allMessages
    .map((message) => `${message.timeMessage} ${message.nickname} ${message.chatMessage}`);
  res.render('index', { renderMessages });
});

const allUsers = [];

const getRandom = () => {
  const length = 16;
  const characteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characteres.charAt(Math.floor(Math.random() * characteres.length));
  }
  return result;
};

const addNewUser = (socket) => {
  const newUser = {
    id: socket.id,
    nickname: getRandom(),
  };
  allUsers.push(newUser);

  return [newUser];
};

const handleNickname = (newNickname, socket) => {
  const index = allUsers.findIndex((user) => user.id === socket.id);
  allUsers[index].nickname = newNickname;
};

const timestamp = () => {
  const time = moment().format('DD-MM-YYYY hh:mm:ss A');
  return time;
};

const handleChatMessage = ({ nickname, chatMessage }) => {
  const timeMessage = timestamp();

  createMessage({ nickname, chatMessage, timeMessage });
  const response = `${timeMessage} ${nickname} ${chatMessage}`;
  io.emit('message', response);
};

io.on('connection', (socket) => {
  const newUser = addNewUser(socket);
  io.emit('connected', newUser);
  const onlineUsers = allUsers.filter((user) => user.id !== newUser[0].id);
  socket.emit('usersOnline', onlineUsers);

  socket.on('message', async ({ chatMessage, nickname }) => {
    handleChatMessage({ nickname, chatMessage });
  });

  socket.on('changeNickname', ({ newNickname }) => {
    handleNickname(newNickname, socket);
    const userChanged = allUsers.find((user) => user.id === socket.id);
    io.emit('changeNickname', userChanged);
  });

  socket.on('disconnect', () => {
    const userDisconnected = allUsers.findIndex((user) => user.id === socket.id);
    allUsers.splice(userDisconnected, 1);
    io.emit('updateOnlineUsers', socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Lintening on ${PORT}`);
});
