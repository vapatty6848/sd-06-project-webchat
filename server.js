require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const users = [];

const config = {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(server, config);

const { addMessage, getMessages } = require('./models/index');
const { date } = require('./utils/index');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.engine('ejs', require('ejs').renderFile);

const connected = (nickname, socket) => {
  users.unshift({ nickname, socketId: socket.id });
  socket.broadcast.emit('connected', [{ nickname, socketId: socket.id }]);
  socket.emit('connected', users);
};

io.on('connection', (socket) => {
  socket.on('connected', ({ nickname }) => {
    connected(nickname, socket);
  });
  socket.on('nickChange', ({ nickname, socketId }) => {
    const userIndex = users.findIndex((user) => user.socketId === socketId);
    users.splice(userIndex, 1, { nickname, socketId });
    io.emit('nickChange', nickname, socketId);
  });
  socket.on('message', ({ nickname, chatMessage, userId }) => {
    addMessage({ date, nickname, chatMessage, userId });
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
  socket.on('disconnect', () => {
    const userIndex = users.findIndex((user) => user.socketId === socket.id);
    users.splice(userIndex, 1);
    io.emit('user-off', { id: socket.id });
  });
});

app.use('/', async (_req, res) => {
  const messages = await getMessages();
  res.render('index.ejs', { messages });
});

server.listen(3000);
