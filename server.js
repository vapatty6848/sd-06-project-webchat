const express = require('express');

const app = express();

const fetch = require('node-fetch');

const http = require('http').createServer(app);

const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { formatDate } = require('./functions');

app.use(cors());
app.use(express.json());

const sendToMongo = (message) => {
  fetch('http://localhost:3000/', {
    method: 'POST',
    body: JSON.stringify(message),
    headers: { 'Content-type': 'application/json' },
    });
};
let nicknames = [];

const changeUser = (nickname, nick) => {
  const position = nicknames.findIndex((e) => e === nick);
  nicknames[position] = nickname;
  io.emit('user', nicknames);
};

const newUser = (nickname, socket) => {
  nicknames.push(nickname);
  io.emit('user', nicknames);
  socket.emit('user', nicknames.reverse());
};

io.on('connection', (socket) => {
  let nick;
  socket.on('message', (message) => {
    sendToMongo({ 
      message: `${message.chatMessage}`,
      nickname: `${message.nickname}`,
      timestamp: `${formatDate()}`,
    });
    io.emit('message', `${formatDate()} - ${message.nickname}: ${message.chatMessage}`);
  });
  socket.on('disconnect', () => {
    nicknames = nicknames.filter((e) => e !== nick);
    io.emit('user', nicknames);
  });
  socket.on('user', (nickname) => { newUser(nickname, socket); nick = nickname; });
  socket.on('changeUser', (nickname) => { changeUser(nickname, nick); nick = nickname; });
});
const webChatController = require('./controllers/webChatController');

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(express.static(`${__dirname}/views/`));

app.use('/', webChatController);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});