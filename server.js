const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);

app.set('view engine', 'ejs');

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

  socket.on('message', ({ chatMessage, nickname }) => {
    const thisDate = getThisDate();
    io.emit('message', `${thisDate} ${nickname} ${chatMessage}`);
  });
});

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen('3000', () => console.log('server running'));