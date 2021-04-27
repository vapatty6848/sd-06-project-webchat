const express = require('express');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const model = require('./models/messages');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const PORT = process.env.PORT || 3000;
let users = [];

const formatMessage = ({ timestamp, nickname, chatMessage }) => (
  `${timestamp} - ${nickname} disse: ${chatMessage}`
);

const createNicknameListener = ({ nickname, socket }) => {
  users.push({ id: socket.id, nickname });
  io.emit('updateOnlineUsers', users);
};

const messageListener = async ({ nickname, chatMessage }) => {
  const timestamp = moment().format('DD-MM-yyyy hh:mm:ss');
  const message = formatMessage({ nickname, chatMessage, timestamp });
  await model.saveMessage({ nickname, chatMessage, timestamp });
  io.emit('message', message);
};

const changeNicknameListener = ({ newNickname, socket }) => {
  users.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });
    return user;
  });
  io.emit('updateOnlineUsers', users);
};

const disconnectListener = (socket) => {
  const onlineUsers = users.filter((user) => user.id !== socket.id);
  users = onlineUsers;
  io.emit('updateOnlineUsers', users);
};

io.on('connection', async (socket) => {
  socket.on('createNickname', ({ nickname }) => createNicknameListener({ nickname, socket }));
  socket.on('message', ({ nickname, chatMessage }) => messageListener({ nickname, chatMessage }));
  socket.on('changeNickname', (newNickname) => changeNicknameListener({ newNickname, socket }));
  socket.on('disconnect', () => disconnectListener(socket));
});

app.get('/', async (_req, res) => {
  const previousMessages = await model.getAll();
  const messagesToRender = previousMessages.map((message) => formatMessage(message));
  return res.render('home', { messagesToRender });
});

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
