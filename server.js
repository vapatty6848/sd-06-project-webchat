const express = require('express');
const moment = require('moment');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
});

const Users = require('./models/Users');
const Messages = require('./models/Messages');

app.get('/', async (_req, res) => {
    const url = path.join(__dirname, '/views/chat.ejs');
    const users = await Users.getAll();
    const messages = await Messages.getAll();
    res.render(url, { users, messages });
});

io.on('connect', (socket) => {
  socket.on('newUser', async (nickname) => {
    const user = await Users.create(socket.id, nickname);
    const users = await Users.getAll();
    const messages = await Messages.getAll();
    socket.emit('updateUsers', { user, users, messages });
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const timestamp = moment(new Date()).format('DD-MM-yyyy h:mm:ss A');
    await Messages.create(chatMessage, nickname, timestamp);
    const message = { chatMessage, nickname, timestamp };
    io.emit('message', message);
  });

  socket.on('disconnect', async () => {
    await Users.removeById(socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
