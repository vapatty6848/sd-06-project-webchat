const express = require('express');

const app = express();
const cors = require('cors');
const moment = require('moment');
const http = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { getAllMessages } = require('./models/chat');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  const messages = await getAllMessages();
  res.status(200).render('index', { messages });
});

const onlineUsers = [];

const addNewUser = (socket) => {
  const newUser = {
    id: socket.id,
  };
  onlineUsers.push(newUser);
};

const addNickname = (nickname, socket) => {
  const index = onlineUsers.findIndex((user) => user.id === socket.id);
  onlineUsers[index].nickname = nickname;
};

const changeNickname = (newNickname, socket) => {
  const index = onlineUsers.findIndex((user) => user.id === socket.id);
  onlineUsers[index].nickname = newNickname;
};

const getNickname = (socket) => {
  const index = onlineUsers.findIndex((user) => user.id === socket.id);
  return onlineUsers[index].nickname;
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

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected.`);
  addNewUser(socket);
  console.log(onlineUsers);
  io.emit('connected', getRandom());

  socket.on('message', async ({ chatMessage, nickname }) => {
    addNickname(nickname, socket);
    const response = `${timestamp()} ${getNickname(socket)} ${chatMessage}`;
    io.emit('message', response);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', onlineUsers);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected.`);
    delete onlineUsers[socket.id];
    io.emit('updateUser', { onlineUsers });
  });
});

http.listen(PORT, () => {
  console.log(`Lintening on ${PORT}`);
});
