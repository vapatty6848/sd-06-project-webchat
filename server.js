// Faça seu código aqui
// const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.BASE_URL || 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const PORT = 3000;

const Users = require('./models/Users');
const Messages = require('./models/Messages');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
  const users = await Users.getAllUsers();
  const messages = await Messages.getAllMessages();
  res.render('index', { users, messages });
});

const time = new Date();
const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
  .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

const socketOnUser = (socket) => {
  socket.on('user', async (nickname) => { 
    await Users.createUser(socket.id, nickname);
    const users = await Users.getAllUsers();
    await Messages.getAllMessages();
    io.emit('users', users);
  });
};

const socketOnUserUpdate = (socket) => {
  socket.on('userUpdate', async (user) => {
    await Users.updateUser(user);
    const users = await Users.getAllUsers();
    io.emit('users', users); 
  });
};

const socketOnMessage = (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    await Messages.createMessage(nickname, chatMessage, timeFormated);
    io.emit('message', `${timeFormated} ${nickname} ${chatMessage}`);
  });
};

const socketOnDisconnect = (socket) => {
  socket.on('disconnect', async () => {
    await Users.removeUser(socket.id);
    console.log(`${socket.id} disconnected!`);
    const users = await Users.getAllUsers();
    io.emit('users', users);
  });
};

io.on('connection', (socket) => {
  console.log(`${socket.id} conected!`);
  socketOnUser(socket);
  socketOnUserUpdate(socket);
  socketOnMessage(socket);
  socketOnDisconnect(socket);
});

http.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});