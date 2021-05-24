const cors = require('cors');
const express = require('express');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);

app.use(cors());

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { saveMessage, getAllMessages } = require('./models/chatModel');

let users = [];
const messageDate = () => moment().format('DD-MM-YYYY hh:mm:ss A');

const randomNickname = () => {
  const length = 16;
  const characteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characteres.charAt(Math.floor(Math.random() * characteres.length));
  }
  return result;
};

const connected = (socket) => {
  socket.on('connected', (nickname) => {
    users.push({ nickname, socketId: socket.id });
    io.emit('updateUsers', users);
  });
};

io.on('connection', (socket) => {
  connected(socket);

  socket.on('message', ({ chatMessage, nickname }) => {
    const editedMessage = `${messageDate()} - ${nickname}: ${chatMessage}`;
    io.emit('message', editedMessage);
    saveMessage(editedMessage);
  });

  socket.on('updateNickname', (nickname) => {
    users = users.map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, nickname };
      }
      return user;
    });
    io.emit('updateUsers', users);
  });

  // Canal reservado
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });
});

app.set('view engine', 'ejs'); // Cria uma view do lado do servidor, usando um ejs que é um view engine(motor de criação);
app.set('views', './views');

app.get('/', async (_req, res) => {
  const allMessages = await getAllMessages();
  res.render('home', { nickname: randomNickname(), users, allMessages });
});

httpServer.listen('3000');
