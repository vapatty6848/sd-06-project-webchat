const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(cors());

const { addMessages, getAllMsgs } = require('./models/messages');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let allUsers = [];

const addNewUser = ({ nickname, socket }) => {
  allUsers.push({ id: socket.id, nickname });

  io.emit('updateOnlineUsers', allUsers);
};

const changeNickname = ({ newNickname, socket }) => {
  allUsers.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });

    return user;
  });

  io.emit('updateOnlineUsers', allUsers);
};

const handleNickname = (nickname, socket) => {
  const index = allUsers.findIndex((user) => user.id === socket.id);
  allUsers[index].nickname = nickname;
  console.log(allUsers);
};

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
    .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

const findNickname = (socket) => {
  const index = allUsers.findIndex((user) => user.id === socket.id);
  return allUsers[index].nickname;
};

const handleChatMessage = async ({ nickname, chatMessage }, socket) => {
  handleNickname(nickname, socket);
  const timestamp = getTime();
  const result = `${timestamp} ${findNickname(socket)} ${chatMessage}`;
  await addMessages({ nickname, chatMessage, timestamp });
  io.emit('message', result);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => addNewUser({ nickname, socket }));

  socket.on('message', async ({ nickname, chatMessage }) =>
    handleChatMessage({ nickname, chatMessage }, socket));

    socket.on('changeNickname', (newNickname) => changeNickname({ newNickname, socket }));

  socket.on('disconnect', () => {
    const onlineUsers = allUsers.filter((user) => user.id !== socket.id);
    allUsers = onlineUsers;
    io.emit('updateOnlineUsers', allUsers);
  });
});

app.get('/', async (_req, res) => {
  const msgs = await getAllMsgs();
  const renderMsgs = msgs.map((message) => 
    `${message.timestamp} ${message.nickname} ${message.chatMessage}`);
  return res.render('index', { renderMsgs });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
