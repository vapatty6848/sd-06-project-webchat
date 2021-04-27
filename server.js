// Faça seu código aqui
const express = require('express');

const app = express();
const PORT = 3000;
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const model = require('./models/messages');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/views/`));

app.get('/', (req, res) => {
  res.render('index');
});

const users = [];

const addNewUser = (socket, nickname) => {
  const newUser = {
    id: socket.id,
    nickname,
  };
  users.push(newUser);
};

const addNickname = (nickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = nickname;
};

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
    .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

const changeNickname = (newNickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = newNickname;
};

const getNickname = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  return users[index].nickname;
};

const getRandomString = () => {
  const length = 16;
  const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

const removeDisconnected = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users.splice(index, 1);
};

io.on('connection', (socket) => {
  const stringNickname = getRandomString();
  socket.emit('userConnected', { stringNickname, users }); addNewUser(socket, stringNickname);
  socket.broadcast.emit('connected', stringNickname);
  socket.on('message', async ({ chatMessage, nickname }) => {
    addNickname(nickname, socket);
    const time = getTime();
    const response = `${time} ${getNickname(socket)} ${chatMessage}`;
    io.emit('message', response);
    await model.createMessage(chatMessage, getNickname(socket), time);
  });
  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', users);
  });
  socket.on('disconnect', () => {
    removeDisconnected(socket);
    socket.broadcast.emit('desconectar', users);
  });
});

app.get('/', async (_req, res) => {
  const msgs = await model.getAllMsgs();
  const renderMsgs = msgs.map((message) => 
    `${message.timestamp} ${message.nickname} ${message.chatMessage}`);
  return res.render('index', { renderMsgs });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});