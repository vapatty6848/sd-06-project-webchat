const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const utils = require('./utils');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.status(200).render('index');
});

const usersOnline = [];

io.on('connection', (socket) => {
  console.log('Usuário conectado ao chat.');
  socket.on('userLogin', ({ user, prevUser = '' }) => {
    console.log('prevUser: ', prevUser);
    const prevUserIndex = usersOnline.indexOf(prevUser);
    if (prevUserIndex >= 0) usersOnline.splice(prevUserIndex, 1);

    usersOnline.push(user);

    io.emit('usersOnline', usersOnline);
  });

  socket.on('clientMessage', (msg) => {
    const date = new Date();
    const timestamp = `${utils.formatTimestamp(date)}`;

    const chatMessage = `${timestamp} - ${msg.nickname}: ${msg.chatMessage}`;
    io.emit('message', { nickname: msg.nickname, chatMessage });
  });

  socket.on('disconnect', () => {
    console.log('Usuário saiu do chat.');
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
