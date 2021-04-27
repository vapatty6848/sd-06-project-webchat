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
// const messages = require('./models/messages');

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

let userList = [];

io.on('connection', (socket) => {
  console.log(`usuário conectado ${socket.id}`);
  
  socket.on('connectedUser', async ({ id, nickname }) => {
    console.log(nickname, 'nickname server');
    io.emit('connectedUser', ({ id, nickname }));
    userList.push({ id, nickname });
    // se ja existir trocar no banco e no array
    // await users.createUser(id, nickname);
  });

  socket.on('newNickname', async ({ id, nickname }) => {
    io.emit('newNickname', { id, nickname });
    // await users.updateUser(id, nickname);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = getDate();
  //  await messages.createMessage({ message: chatMessage, nickname, timestamp });
    const newMessage = `${timestamp} ${nickname} ${chatMessage}`;
    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('usuário desconectado');
    userList = userList.filter((e) => e.id !== socket.id);
  });
});

app.get('/', (req, res) => {
  res.render('chat/index', { userList });
});

http.listen(3000, () => console.log('Servidor na porta 3000'));
