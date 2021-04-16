const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const users = [];

const onMessage = ({ chatMessage, nickname }) => {
  const now = new Date();
  const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}
  ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  const message = `${timestamp} ${nickname} ${chatMessage}`;

  io.emit('message', message);
};

const generateNickName = (id) => {
  const sliceNickname = (id).slice(-16);
  return sliceNickname;
};

const saveUser = (nickname) => {
  users.push(nickname);
};

const onChangeNickname = ({ nickname, newNickname }) => {
  const index = users.indexOf(nickname);
  if (index >= 0) {
    users[index] = newNickname;
    
    io.emit('changeNickName', { nickname, newNickname });
  }
};

io.on('connection', (socket) => {
  console.log(`Usuário novo conectado ${socket.id}`);
  const nickName = generateNickName(socket.id);

  io.emit('randomNickname', nickName);

  saveUser(nickName);

  socket.on('message', onMessage);

  socket.on('changeNickname', onChangeNickname);

  socket.on('disconnect', () => {
    io.emit('disconnectMessage', `Usuário no socket ${socket.id} se desconectou`);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('homeView');
});

httpServer.listen('3000');
