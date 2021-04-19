const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(cors());

// const { addMessages, getAllMsgs } = require('./models/messages');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (_req, res) => {
  res.render('index');
});

const allUsers = [];

const addNewUser = (socket) => {
  const newUser = {
    id: socket.id,
  };
  allUsers.push(newUser);
};

const handleNickname = (nickname, socket) => {
  const index = allUsers.findIndex((user) => user.id === socket.id);
  allUsers[index].nickname = nickname;
};

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
    .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

const findNickname = (socket) => {
  const index = allUsers.findIndex((user) => user.id === socket.id);
  return allUsers[index].nickname;
};

const getRandomString = () => {
  const length = 16;
  const random = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += random.charAt(Math.floor(Math.random() * random.length));
  }
  return result;
};

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  addNewUser(socket);
  io.emit('connected', getRandomString());

  socket.on('message', ({ chatMessage, nickname }) => {
    handleNickname(nickname, socket);
    const result = `${getTime()} ${findNickname(socket)} ${chatMessage}`;
    io.emit('message', result);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    handleNickname(newNickname, socket);
    io.emit('changeNickname', allUsers);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
