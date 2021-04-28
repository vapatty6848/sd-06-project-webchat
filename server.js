const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const MessageModel = require('./models/MessageModel');

const users = [];
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
    console.log('new user: ', nickname)
    users.push({ nickname, socketId: socket.id });
    io.emit('public-nickname', users, nickname);
  });

  socket.on('change-nickname', (nickname, idFromClient) => {
    const userToChangeNickname = users.find((user) => user.socketId === idFromClient);
    userToChangeNickname.nickname = nickname;
    const shouldClearNicknameList = true;
    socket.emit('public-nickname', users, shouldClearNicknameList);
  });
  
  socket.on('message', (message) => {
    const { today, now } = createDateString();
    io.emit('message', `${today} ${now}: ${message.nickname}: ${message.chatMessage}`);
    MessageModel.createMessage({ nickname: message.nickname,
      message: message.chatMessage,
      timestamp: `${today} ${now}` });
  });

  socket.on('disconnect', () => {
    const userToBeRemoved = users.find(user => user.socketId === socket.id)
    const identifierList = users.map(user => user.nickname)
    const identifierToBeRemoved = userToBeRemoved ? userToBeRemoved.nickname : 'error'
    const identifierIndex = identifierList.indexOf(identifierToBeRemoved)
    console.log('identifierIndex', identifierIndex)
    console.log('socket', identifierToBeRemoved)
    console.log('userToBeRemoved', userToBeRemoved)
    console.log('identifierList', identifierList)
    
    console.log('users antes', users)
    users.splice(identifierIndex === -1 ? null : identifierIndex, 1) //esta com erro, é necessario tratar o estado inicial em que nao ha ninguem p remover e o index é -1
    console.log('users depois', users)
    io.emit('public-nickname', users);
  })

});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  const messages = await MessageModel.findAllMessages();
  res.render('home', { messages });
});

httpServer.listen('3000', () => console.log('Running on port 3000'));