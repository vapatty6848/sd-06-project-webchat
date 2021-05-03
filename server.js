require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const Messages = require('./models/Messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

const users = {};

const onUserConnection = (currentUser, socket) => {
  users[socket.id] = currentUser;
  io.emit('showOnlineUsers', users);
};

const onChangeNickname = (newNickname, socket) => {
  users[socket.id] = newNickname;
  io.emit('showOnlineUsers', users);
};

io.on('connection', (socket) => {
  Messages.get().then((messages) => io.emit('showMessageHistory', messages));

  socket.on('userConection', (user) => onUserConnection(user, socket));

  socket.on('changeNickname', (nickname) => onChangeNickname(nickname, socket));

  socket.on('message', ({ nickname, chatMessage: message }) => {
    Messages.create({ nickname, message });
    io.emit(
      'message',
      `${moment(new Date()).format('DD-MM-yyyy hh:mm:ss')} - ${nickname}: ${message}`,
    );
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('showOnlineUsers', users);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
