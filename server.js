require('dotenv/config');
const { set } = require('lodash');

const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { messages } = require('./models');
const utils = require('./utils');

app.set('view engine', 'ejs');
app.use(cors());

app.get('/', async (_req, res) => {
  const allMessages = await messages.getAllMessages();
  res.render('home', { allMessages });
});

const USERS = [];

const socketNewNickname = ({ socket, newNickname }) => {
  const userIndex = USERS.findIndex((user) => user.id === socket.id);
  set(USERS[userIndex], 'nickname', newNickname);
  io.emit('updateUsers', USERS);
};

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    USERS.push({ id: socket.id, nickname });
    io.emit('updateUsers', USERS);
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    const date = utils.getNewFormattedDate();
    io.emit('message', `${date} ${nickname} ${message}`);
    await messages.createMessage(date, nickname, message);
  });

  socket.on('newNickname', (newNickname) => socketNewNickname({ socket, newNickname }));

  socket.on('disconnect', () => {
    const userIndex = USERS.findIndex((user) => user.id === socket.id);
    USERS.splice(userIndex, 1);
    io.emit('updateUsers', USERS);
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Lintening on port ${PORT}`);
});
