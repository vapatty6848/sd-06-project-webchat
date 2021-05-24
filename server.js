require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.engine('ejs', require('ejs').renderFile);

const users = [];

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

const { date, randomNickName } = require('./utils/index');

io.on('connection', (socket) => {
  socket.on('connected', ({ nickname }) => {
    users.push({ nickname, socketId: socket.id });
  });

  socket.on('message', ({ nickname, chatMessage }) => {
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    console.log({ nickname, chatMessage }, users);
  });
});

app.use('/', (_req, res) => {
  res.render('index.ejs', { nickname: randomNickName(), users });
});

server.listen(3000);
