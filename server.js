require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

let users = [];
const config = {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(server, config);

const { addMessage, getMessages, updtadeNickname } = require('./models/index');
const { date } = require('./utils/index');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.engine('ejs', require('ejs').renderFile);

io.on('connection', (socket) => {
  socket.on('connected', ({ nickname }) => {
    users.push({ nickname, socketId: socket.id });
    io.emit('connected', { nickname, id: socket.id });
  });

  socket.on('nickChange', async ({ nickname, id }) => {
    users = users.filter((user) => user.socketId !== id);
    users.push({ nickname, socketId: id });
    await updtadeNickname(id, nickname);
    io.emit('nickChange', nickname, id);
  });

  socket.on('message', async ({ nickname, chatMessage, userId }) => {
    addMessage({ date, nickname, chatMessage, userId });
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
});

app.use('/', async (_req, res) => {
  const messages = await getMessages();
  res.render('index.ejs', { users, messages });
});

server.listen(3000);
