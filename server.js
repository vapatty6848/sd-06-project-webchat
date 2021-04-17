const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const currentDateFormat = require('./utils/currentDateFormat');
const { getAll, uploadDB } = require('./models/mongoDbRequests');

const PORT = 3000;

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './view');

let arrayUsersOn = [];

const disconnect = (socket) => {
  arrayUsersOn = arrayUsersOn.filter((element) => element.idSocket !== socket.id);
  io.emit('userOff', socket.id);
};

io.on('connection', (socket) => {
  socket.on('disconnect', () => disconnect(socket));

  socket.on('userOn', (nickname) => {
    arrayUsersOn.push({ nickname, idSocket: socket.id });
    socket.broadcast.emit('usersOn', { nickname, idSocket: socket.id });
  });

  socket.on('userUpdate', (nickname) => {
    arrayUsersOn = arrayUsersOn.filter((element) => element.idSocket !== socket.id);
    arrayUsersOn.push({ nickname, idSocket: socket.id });
    console.log('arrayUsersOn update', arrayUsersOn);
    socket.broadcast.emit('userNicknameUpdate', { nickname, idSocket: socket.id });
  });

  socket.on('message', (msg) => {
    const { nickname, chatMessage } = msg;
    const currentDate = currentDateFormat();
    uploadDB('messages', { currentDate, nickname, chatMessage });
    io.emit('messageCli', {
      message: `${currentDate} - ${nickname}: ${chatMessage}`, idCli: socket.id });
  });
});

app.get('/', async (_req, res) => {
  const arrayMessages = await getAll('messages');
  console.log('arrayUsersOn 1', arrayUsersOn);
  res.render('./chat', { arrayMessages, arrayUsersOn });
});

app.use((err, _req, res, _next) => {
  console.error({ err });
  res.status(500).json({ erro: 'erro interno' });
});

http.listen(PORT, () => {
  console.log('Servidor ouvindo na porta ', PORT);
});
