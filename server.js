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

const users = [];

function getThisDate() {
  const newDate = new Date();
  const day = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;
  const hour = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;

  return `${day} ${hour}`;
}

io.on('connection', (socket) => {
  console.log(`new user connected: ${socket.id}`);

  users.push({ socketId: socket.id });

  io.emit('updateUsers', users);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamps = getThisDate();

    const msgString = `${timestamps} ${nickname} ${chatMessage}`;

    io.emit('message', msgString);

    await saveMessage({ message: chatMessage, nickname, timestamps });
  });
});

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen('3000', () => console.log('server running'));