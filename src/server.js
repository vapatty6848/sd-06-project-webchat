require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http').createServer(app);

const cors = require('cors');
const nunjucks = require('nunjucks');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { uuid } = require('uuidv4');

const Message = require('./database/models/Message');
const { formatMessage } = require('./utils/formatMessage');

app.use(express.static(`${__dirname}/public`));

nunjucks.configure(`${__dirname}/views`, {
  express: app,
  noCache: true,
});

const appRoutes = require('./routes');

app.use(cors());

app.use(appRoutes);

let connectedUsers = [];

io.on('connection', (socket) => {
  const user = { nickname: '', id: uuid() };

  socket.on('newUser', (nickname) => {
    user.nickname = nickname;

    socket.emit('users', [user, ...connectedUsers]);
    connectedUsers.push(user);

    socket.broadcast.emit('newUser', user);
  });

  socket.on('newNickname', (newNickname) => {
    user.nickname = newNickname;
    connectedUsers = connectedUsers.map((connected) => {
      if (connected.id !== user.id) return connected;

      const newNick = { ...connected, nickname: newNickname };

      return newNick;
    });
    socket.broadcast.emit('newNickname', user);
  });

  socket.on('disconnect', () => {
    // socket.broadcast.emit('mensagemServer', { mensagem: `Client ID ${clientID} has left` });
    connectedUsers = connectedUsers.filter((connected) => user.nickname !== connected.nickname);
  });

  socket.on('message', async (msg) => {
    const { chatMessage, nickname } = msg;

    const messageModel = new Message();
    const timestamp = new Date(Date.now()).toISOString();

    const createdMessage = await messageModel.create({ timestamp, chatMessage, nickname });

    const formattedMessage = formatMessage(createdMessage);

    io.emit('message', formattedMessage);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
