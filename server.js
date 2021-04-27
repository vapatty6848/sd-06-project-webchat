const express = require('express');
const cors = require('cors');

const app = express();

const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// const users = require('./models/users');
const messages = require('./models/messages');

app.use(cors());

const twoDigitsNumber = (number) => {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
};

const getDate = () => {
  const date = new Date();
  const day = twoDigitsNumber(date.getDate());
  const month = twoDigitsNumber(date.getMonth());
  const year = date.getFullYear();
  const hour = twoDigitsNumber(date.getHours());
  const minute = twoDigitsNumber(date.getMinutes());
  const seconds = twoDigitsNumber(date.getSeconds());

  const newFormatDate = `${day}-${month}-${year} ${hour}:${minute}:${seconds}`;
  return newFormatDate;
};

const filterUser = (List, id, nickname) => {
  const list = List.map((e) => {  
    if (e.id === id) return { ...e, nickname };
    return e;
     });
     return list;
};
const newMessage = (chatMessage, nickname) => `${getDate()} ${nickname} ${chatMessage}`;

let userList = [];

io.on('connection', (socket) => {
  console.log(`usuário conectado ${socket.id}`);
  socket.on('connectedUser', async ({ id, nickname }) => {
    io.emit('connectedUser', ({ id, nickname }));
    userList.push({ id, nickname });
  });
  socket.on('newNickname', async ({ id, nickname }) => {
    io.emit('newNickname', { id, nickname });
   userList = filterUser(userList, id, nickname);
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    messages.createMessage({ message: chatMessage, nickname, timestamp: getDate() });
    io.emit('message', newMessage(chatMessage, nickname));
  });
  socket.on('disconnect', () => {
    console.log('usuário desconectado');
    userList = userList.filter((e) => e.id !== socket.id);
  });
});

app.get('/', async (req, res) => {
  const allMessages = await messages.getAllMessages();
  console.log(allMessages);
  res.render('chat/index', { userList, allMessages });
});

http.listen(3000, () => console.log('Servidor na porta 3000'));
