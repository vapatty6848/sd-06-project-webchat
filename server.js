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

io.on('connection', (socket) => {
  console.log(`Usuário novo conectado ${socket.id}`);

  const sliceNickname = (socket.id).slice(-16);
  io.emit('randomNickname', sliceNickname);

  users.push({ socketId: sliceNickname });
  io.emit('updateUsers', users);

  socket.on('message', ({ chatMessage, nickname }) => {
    const now = new Date();
    const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}
    ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const message = `${timestamp} ${nickname} ${chatMessage}`;

    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    io.emit('disconnectMessage', `Usuário no socket ${socket.id} se desconectou`);
    io.emit('updateUsers', users);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('homeView');
});

httpServer.listen('3000');
