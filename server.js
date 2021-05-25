// Faça seu código aqui
const moment = require('moment');
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const port = 3000;

const io = require('socket.io')(httpServer);

const date = () => moment().format('DD-MM-YYYY hh:mm:ss A');
let sockets = [];

const nicknameUpdater = (oldNickname, newNickname) => {
  sockets.forEach((item, i) => {
    const { userId } = item;
    if (item.nickname === oldNickname) {
      sockets[i] = { userId, nickname: newNickname };
    }
  });
};

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    const { nickname, chatMessage } = data;
    const message = `${date()} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
    sockets.push({ nickname, userId: socket.id });
  });
  socket.on('newNickname', ({ newNickname, oldNickname }) => {
    nicknameUpdater(oldNickname, newNickname);
    io.emit('newUserList', sockets);
  });
  socket.on('createNickname', (nickname) => {
    sockets.push({ nickname, userId: socket.id });
    io.emit('newUserList', sockets);
  });
  socket.on('disconnect', () => {
    sockets = sockets.filter((item) => item.userId !== socket.id);
    io.emit('newUserList', sockets);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen(port);
