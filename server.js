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

let allUsers = [];

const addNewUser = (socket) => {
  const newUser = {
    id: socket.id,
  };
  allUsers.push(newUser);
};

const handleNickname = (newNickname, socket) => {
  const index = allUsers.findIndex((user) => user.id === socket.id);
  allUsers[index].nickname = newNickname;
};

const timestamp = () => {
  const time = moment().format('DD-MM-YYYY hh:mm:ss A');
  return time;
};

const getRandom = () => {
  const length = 16;
  const characteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characteres.charAt(Math.floor(Math.random() * characteres.length));
  }
  return result;
};

const handleChatMessage = ({ nickname, chatMessage }) => {
  const timeMessage = timestamp();

  createMessage({ nickname, chatMessage, timeMessage });
  const response = `${timeMessage} ${nickname} ${chatMessage}`;
  io.emit('message', response);
};

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected.`);
  addNewUser(socket);
  console.log(allUsers);
  io.emit('connected', getRandom());

  socket.on('message', async ({ chatMessage, nickname }) => {
    handleChatMessage({ nickname, chatMessage });
  });

  socket.on('changeNickname', ({ newNickname }) => {
    handleNickname(newNickname, socket);
    io.emit('changeNickname', allUsers);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected.`);
    delete allUsers[socket.id];
    const newAllUsers = allUsers.filter((user) => user.id !== socket.id);
    allUsers = newAllUsers;
    io.emit('updateOnlineUsers', allUsers);
  });
});

http.listen(PORT, () => {
  console.log(`Lintening on ${PORT}`);
});
