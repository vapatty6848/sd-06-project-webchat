const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const MessageModel = require('./models/MessageModel');

const users = [];
// const messages = [];

  // Source: https://attacomsian.com/blog/javascript-generate-random-string
const randomNicknameGenerator = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let nickname = '';
  for (let i = 0; i < length; i += 1) {
      nickname += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return nickname;
};

const createDateString = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const today = `${day}-${month}-${year}`;
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const now = `${hour}:${minute}:${second}`;

  return { today, now };
};

io.on('connection', (socket) => {
  socket.on('random-nickname', () => {
    const nickname = randomNicknameGenerator();
    users.push({ nickname, socketId: socket.id });
    socket.emit('public-nickname', users);
  });

  socket.on('change-nickname', (nickname, idFromClient) => {
    const userToChangeNickname = users.find((user) => user.socketId === idFromClient);
    userToChangeNickname.nickname = nickname;
    const shouldClearNicknameList = true;
    socket.emit('public-nickname', users, shouldClearNicknameList);
  });
  
  socket.on('message', (message) => {
    // console.log('message', message)
    const { today, now } = createDateString();
    // const messageContent = `${today} ${now} -> ${message.nickname}: ${message.chatMessage}`;
    // messages.push(messageContent);
    io.emit('message', `${today} ${now} -> ${message.nickname}: ${message.chatMessage}`);
    MessageModel.createMessage({ nickname: message.nickname,
      message: message.chatMessage,
      timestamp: `${today} ${now}` });
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen('3000', () => console.log('Running on port 3000'));