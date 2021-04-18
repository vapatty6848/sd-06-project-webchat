const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});
const router = require('./controllers');
const chat = require('./controllers/chatController');
const helper = require('./helpers');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(router);

const onlineUsers = [];

const loginHandler = (socket) => {
  let userName;
  socket.on('login', async ({ user, prevUser = '' }) => {
    const findUser = onlineUsers.indexOf(prevUser);
    if (findUser >= 0) { onlineUsers.splice(findUser, 1); }
    userName = user.slice();
    onlineUsers.push(userName);
    io.emit('onlineUsers', onlineUsers);
});

socket.on('disconnect', () => {
  const findUser = onlineUsers.indexOf(userName);
  if (findUser >= 0) { onlineUsers.splice(findUser, 1); }
  io.emit('onlineUsers', onlineUsers);
});
};

const chatHandler = (socket) => {
  socket.on('message', async (msg) => {
    const date = new Date();
    const dateANDtimeFront = `${helper.formatDate(date)} ${helper.formatTime(date)}`;
    const chatMessageFront = helper.formatMessage(dateANDtimeFront, msg);

    const dateANDtimeBack = `${helper.formatDate(date, 'back-end')} ${helper.formatTime(date)}`;
    const chatMessageBack = {
      timestamp: dateANDtimeBack,
      nickname: msg.nickname,
      message: msg.chatMessage,
    };

    await chat.create(chatMessageBack);
  
    io.emit('message', chatMessageFront);
  });
};

io.on('connection', (socket) => {
  loginHandler(socket);
  chatHandler(socket);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
