// Faça seu código aqui
const express = require('express');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const messages = require('./models/messages');

const users = [];

app.use(cors());

app.get('/', (_req, res) => {
  res.render(`${__dirname}/views/home.ejs`);
});

io.on('connection', async (socket) => {
  const guest = { id: socket.id, name: (`${socket.id}`).slice(0, 16) };
  users.push(guest);
  socket.emit('user', guest);
  io.emit('updatedUserList', users);
  const oldMessages = await messages.getAllMessages();
  socket.emit('oldChat', oldMessages);
  socket.on('updateUser', ({ name, id }) => {
    const index = users.indexOf(users.find((user) => user.id === id));
    users[index].name = name;
    io.emit('updatedUserList', users);
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    const brDate = moment().format('DD-MM-YYYY H:mm:ss');
    const message = `${brDate} - ${nickname}: ${chatMessage} `;
    await messages.createMessage(chatMessage, nickname, brDate);
    io.emit('newMessage', message);
  });
});

httpServer.listen(3000, () => {
  console.log('Chat Inicializado');
});
