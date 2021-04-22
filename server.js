const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  },
});

const { messageFormat, randomNickname } = require('./utils');

app.use(cors());

// app.use('/views', express.static('views'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

const sockets = [];

io.on('connection', (socket) => {
  console.log(`${socket.id} conectou!`);

  sockets.push({ id: socket.id, nickname: randomNickname() });

  io.emit('onlineUsers', sockets);
  // { id: 'Seja bem vindo(a)', randomNickname: randomNickname() }
  // socket.broadcast.emit('message', message({ chatMessage: 'se conectou', nickname: socket.id }));
  
  socket.on('disconnect', () => {
    const userIndex = sockets.findIndex((user) => user.id === socket.id);
    sockets.splice(userIndex, 1);
    io.emit('onlineUsers', sockets);
    console.log('Desconectado');
  });
  
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', messageFormat({ chatMessage, nickname }));
  });

  socket.on('nickname', ({ nickname }) => {
    const userIndex = sockets.findIndex((user) => user.id === socket.id);
    sockets[userIndex].nickname = nickname;
    io.emit('onlineUsers', sockets);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});