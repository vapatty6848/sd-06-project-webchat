const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);

app.set('view engine', 'ejs');

const { saveMessage, getAllMessages } = require('./models/messages');

app.get('/', async (_req, res) => {
  const messages = await getAllMessages();
  res.render('home', { messages });
});

let users = [];

function getThisDate() {
  const newDate = new Date();
  const day = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;
  const hour = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;

  return `${day} ${hour}`;
}

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    users.push({ socketId: socket.id, nickname });
    io.emit('updateUsers', users);
  });

  socket.on('newNickname', ({ id, nickname }) => {
    const userToUpdate = users.find((u) => u.socketId === id);
    const userIndex = users.indexOf(userToUpdate);
    users[userIndex].nickname = nickname;
    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamps = getThisDate();
    const msgString = `${timestamps} ${nickname} ${chatMessage}`;
    io.emit('message', msgString);
    await saveMessage({ message: chatMessage, nickname, timestamps });
  });

  socket.on('disconnect', () => {
    const onlineUsers = users.filter((u) => u.socketId !== socket.id);
    users = onlineUsers;
    io.emit('updateUsers', users);
  });
});

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen('3000', () => console.log('server running'));
