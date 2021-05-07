const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv/config');

const { formatDate, formatMessage } = require('./utils');
const routes = require('./routes');
const { chatController } = require('./controllers');

const app = express();
const server = http.createServer(app);

const options = {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
};
const io = new Server(server, options);

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(routes);

let users = [];
const dateFormated = formatDate();

const newUserConnected = (socket, nickname) => {
  users.push({ socketId: socket.id, nickname });
  io.emit('updateUsers', users);
};

io.on('connection', (socket) => {
  socket.on('new-user-connected', (nickname) => newUserConnected(socket, nickname));

  socket.on('update-nickname', (nickname) => {
    const userIndex = users.findIndex((user) => user.socketId.includes(socket.id));
    users[userIndex].nickname = nickname;
    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const message = formatMessage(dateFormated, chatMessage, nickname);
    chatController.createMessages(chatMessage, nickname, dateFormated);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    const newUsers = users.filter((user) => user.socketId !== socket.id);
    users = [...newUsers];
    io.emit('updateUsers', users);
  });
});

module.exports = server;
