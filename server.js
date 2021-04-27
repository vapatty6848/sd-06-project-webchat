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

const messageModel = require('./models/messageModel');

app.use(cors());

const users = [];

const now = new Date();
const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}
${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

const onConnectUser = ({ nickname, socket }) => {
  users.push({ id: socket.id, nickname });
  io.emit('updateUsers', users);
};

const onChangeNickname = ({ nickname, newNickname }) => {
  const index = users.findIndex((user) => user.nickname === nickname);

  if (index >= 0) {
    users[index].nickname = newNickname;
    io.emit('updateUsers', users);
  }
};

const onDisconnect = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users.splice(index, 1);

  io.emit('updateUsers', users);
};

io.on('connection', (socket) => {
  socket.on('connectUser', ({ nickname }) => onConnectUser({ nickname, socket }));

  socket.on('message', async ({ chatMessage, nickname }) => {
    // const msg = await messageModel.create(chatMessage, nickname, timestamp);
    messageModel.create(chatMessage, nickname, timestamp);
    io.emit('message', `${timestamp} ${nickname} ${chatMessage}`);
  });

  socket.on('changeNickname', ({ nickname, newNickname }) => {
    onChangeNickname({ nickname, newNickname });
  });

  socket.on('disconnect', () => onDisconnect(socket));
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
  const messages = await messageModel.getAll();
  res.render('homeView', { messages });
});

httpServer.listen('3000');
// commit de sabádo -> ecc999f
