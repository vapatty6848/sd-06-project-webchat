// Faça seu código aqui
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const { createMessage } = require('./models/messages');

const PORT = 3000;

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

let onlineUsers = [];

app.get('/', async (_req, res) => {
  res.render('../views/');
});

io.on('connection', (socket) => {
  const socketId = socket.id;
  const random = `random${socket.id}`;
  console.log(`User ${socketId} connected.`);
  onlineUsers.unshift({ socketId, nickname: random });
  io.emit('connected', { socketId, nickname: random });
  
  socket.on('disconnect', () => console.log(`User ${socket.id} disconnected.`));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY hh:mm:ss A');
    await createMessage({ chatMessage, nickname, timestamp });
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('changeNickname', (nickname) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    onlineUsers.push({ socketId, nickname });
    io.emit('changeNickname', { socketId, nickname });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
