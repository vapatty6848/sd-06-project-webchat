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

io.on('connection', (socket) => {
  console.log(`${socket.id} conected!`);

  socket.on('user', async (nickname) => {
  const user = await Users.createUser(socket.id, nickname);
  const users = await Users.getAllUsers();
  const messages = await Messages.getAllMessages();
  io.emit('users', { user, users, messages });
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const time = new Date();
    const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
     .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    await Messages.createMessage(nickname, chatMessage, timeFormated);
    io.emit('message', `${timeFormated} ${nickname} ${chatMessage}`);
  });
    
  socket.on('disconnect', async () => {
    console.log(`${socket.id} disconnected!`);
    await Users.removeUser(socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});