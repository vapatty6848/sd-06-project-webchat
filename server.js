require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const Messages = require('./models/Messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

const users = {};

io.on('connection', async (socket) => {
  const messages = await Messages.get();

  io.emit('showMessageHistory', messages);

  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    io.emit('showOnlineUsers', users);
  });

  socket.on('changeNickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('showOnlineUsers', users);
  });

  socket.on('message', async ({ nickname, chatMessage: message }) => {
    const newM = await Messages.create({ nickname, message });

    io.emit('message', `${newM.timestamp} - ${newM.nickname || nickname}: ${newM.message}`);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('showOnlineUsers', users);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
