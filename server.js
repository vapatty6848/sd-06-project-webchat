const express = require('express');
const moment = require('moment');
const path = require('path');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
const Messages = require('./models/Messages');
const Users = require('./models/Users');

io.on('connection', (socket) => {
  socket.on('login', async (nickname) => {
    await login(socket, nickname, io);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const timestamp = moment(new Date()).format('DD-MM-yyyy h:mm:ss A');
    const message = await Messages.create(chatMessage, nickname, timestamp);
    io.emit('message', `${message.timestamp} - ${message.nickname} : ${message.message}`);
  });

  socket.on('updateUsers', async (user) => {
    await Users.update(user);
    const users = await Users.getAll();
    io.emit('onlineUsers', users);
  });

  socket.on('disconnect', async () => {
    await Users.removeById(socket.id);
    io.emit('onlineUsers', await Users.getAll());
  });
});

app.get('/', async (_req, res) => {
  const users = await Users.getAll();
  const messages = await Messages.getAll();
  res.render( path.join(__dirname, '/views/chat.ejs'), { users, messages });
});

const login = async (socket, nickname, connection) => {
  await Users.create(socket.id, nickname);
  connection.emit('onlineUsers', await Users.getAll());
};

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));