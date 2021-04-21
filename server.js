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

const saveUser = (nickname) => {
  users.push(nickname);
  io.emit('updateUsers', nickname);
};

const onChangeNickname = ({ nickname, newNickname }) => {
  const index = users.indexOf(nickname);
  if (index >= 0) {
    users[index] = newNickname;
    
    io.emit('changeNickName', { nickname, newNickname });
  }
};

io.on('connection', (socket) => {
  socket.on('connectUser', ({ nickname }) => saveUser(nickname));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const msg = await messageModel.create(chatMessage, nickname, timestamp);
    io.emit('message', `${msg.timestamp} ${msg.nickname} ${msg.message}`);
  });

  socket.on('changeNickname', onChangeNickname);

  socket.on('disconnect', () => console.log(`Usuário no socket ${socket.id} se desconectou`));
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
  const messages = await messageModel.getAll();
  res.render('homeView', { messages });
});

httpServer.listen('3000');
// commit de sabádo -> ecc999f
