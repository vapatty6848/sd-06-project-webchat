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

let users = [];

app.use(cors());

app.get('/', (_req, res) => {
  res.render(`${__dirname}/views/home.ejs`);
});

const newUser = (username, id) => {
  const guest = { id, name: username };
  users.push(guest);
  io.emit('updatedUserList', users);
};

const oldchat = async (socket) => {
  const oldMessages = await messages.getAllMessages();
  socket.emit('oldChat', oldMessages);
};

const updateUsers = (name, id) => {
  const index = users.indexOf(users.find((user) => user.id === id));
  users[index].name = name;
  io.emit('updatedUserList', users);
};

const sendMessage = async ({ chatMessage, nickname }) => {
  const brDate = moment().format('DD-MM-YYYY H:mm:ss');
  const message = `${brDate} - ${nickname}: ${chatMessage} `;
  await messages.createMessage(chatMessage, nickname, brDate);
  io.emit('message', message);
};

const disconnectUser = (id) => {
  users = users.filter((user) => user.id !== id);
  io.emit('updatedUserList', users);
};

io.on('connection', (socket) => {
  oldchat(socket);
  socket.on('newUser', (username) => newUser(username, socket.id));
  socket.on('updateUser', (name) => updateUsers(name, socket.id));
  socket.on('message', ({
    chatMessage,
    nickname,
  }) => sendMessage({ chatMessage, nickname }));
  socket.on('disconnect', () => disconnectUser(socket.id));
});

httpServer.listen(3000, () => {
  console.log('Chat Inicializado');
});
