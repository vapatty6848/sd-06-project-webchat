const express = require('express');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(cors());

const { createMessage, getAll } = require('./models/messages');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/views/`));

let onlineUsers = [];

const addNewUser = ({ nickname, socket }) => {
  onlineUsers.push({ id: socket.id, nickname });
  console.log(onlineUsers);

  io.emit('updateOnlineUsers', onlineUsers);
};

const changeNickname = ({ newNickname, socket }) => {
  onlineUsers.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });

    return user;
  });

  io.emit('updateOnlineUsers', onlineUsers);
};

const handleChatMessage = async ({ nickname, chatMessage }) => {
  const timestamp = moment().format('DD-MM-YYYY hh:mm:ss A');
  const result = `${timestamp} ${nickname} ${chatMessage}`;
  await createMessage({ nickname, chatMessage, timestamp });
  io.emit('message', result);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => addNewUser({ nickname, socket }));

  socket.on('message', async ({ nickname, chatMessage }) =>
    handleChatMessage({ nickname, chatMessage }));

    socket.on('changeNickname', (newNickname) => changeNickname({ newNickname, socket }));

  socket.on('disconnect', () => {
    const users = onlineUsers.filter((user) => user.id !== socket.id);
    onlineUsers = users;
    io.emit('updateOnlineUsers', onlineUsers);
  });
});

app.get('/', async (_req, res) => {
  const msgs = await getAll();
  const messages = msgs.map((message) => 
    `${message.timestamp} ${message.nickname} ${message.chatMessage}`);
  return res.render('index', { messages });
});

http.listen(3000, () => {
  console.log('Servidor online na porta 3000');
});
