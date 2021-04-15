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

  socket.on('message', ({ chatMessage, nickname }) => { // 2. aqui no back ele capta o que foi escrito no canal message lá do front
    const now = new Date();
    const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}
    ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const message = `${timestamp} ${nickname} ${chatMessage}`;

    io.emit('message', message); // 3. aqui meu back, emit a mensagem captada no canal sentMessage para todos os usuarios conectados e cria outro canal, o newMessage que pode ser captado pelo front
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
