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
const chatRouter = require('./routes/chat.routes');
const controllers = require('./controllers/chat.controllers');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(chatRouter);

const usersOnline = [];

io.on('connection', (socket) => {
  console.log('Usuário conectado ao chat.');
  socket.on('userLogin', async ({ user, prevUser = '' }) => {
    // console.log('prevUser: ', prevUser);
    const prevUserIndex = usersOnline.indexOf(prevUser);
    if (prevUserIndex >= 0) usersOnline.splice(prevUserIndex, 1);

    usersOnline.push(user);
    const messages = await controllers.getMessages();

    io.emit('usersOnline', usersOnline);
    io.emit('chatHistory', messages);
  });

  socket.on('clientMessage', async (msg) => {
    const timestamp = `${utils.setTimestamp()}`;

    const message = { timestamp, nickname: msg.nickname, chatMessage: msg.chatMessage };
    await controllers.create(message);

    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Usuário saiu do chat.');
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
