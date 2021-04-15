const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const moment = require('moment');
const io = require('socket.io')(httpServer);

app.use(express.json());

const users = [];

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectou!`);

  socket.on('newUser', (user) => {
    users.push({ socketId: socket.id, userName: user });
    io.emit('updateUsers', users);
  });

  socket.on('message', (obj) => {
    const date = moment().format('DD-MM-yyyy hh:mm');

    io.emit('message', {
      chatMessage: `${date} - ${obj.nickname}: ${obj.chatMessage}`,
      nickname: obj.nickname,
    });
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) return users.splice(index, 1);
  });

  socket.on('changeUser', (newUserName) => {
    const index = users.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) users.splice(index, 1);
    users.push({ socketId: socket.id, userName: newUserName });
    io.emit('updateUsers', users);
  });
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

httpServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
