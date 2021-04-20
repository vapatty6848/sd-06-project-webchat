const express = require('express');
const cors = require('cors');
const httpServer = require('http');
const socketIo = require('socket.io');

const app = express();
const http = httpServer.createServer(app);
const io = socketIo(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/server.html`);
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    socket.broadcast.emit(
      'serverMessage',
      { message: 'Alguém acabou de se desconectar.' },
    );
  });
  socket.on('message', (msg) => {
    io.emit('serverMessage', { message: msg });
  });
  socket.emit('welcome', 'Seja bem vindo ao nosso Chat!');
  socket.broadcast.emit(
    'serverMessage',
    { message: 'Alguém acabou de se conectar.' },
  );
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
