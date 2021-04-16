const express = require('express');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// entender por que não funciona importação
// const nickGenerator = require('./utils/nickGenerator');
// const getTime = require('./utils/getTime');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', (_req, res) => {
  res.render('index');
});

const users = [];

const getTime = () => {
  const date = new Date();
  // https://blog.betrybe.com/javascript/javascript-date-format/#1
  const dateFormated = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date
    .getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return dateFormated;
};

const nickGenerator = () => {
  const length = 16;
  let stringAleatoria = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
};

const newUser = (socket) => {
  const user = {
    id: socket.id,
  };
  users.push(user);
};

const addNickname = (nickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = nickname;
};

const getNickname = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  return users[index].nickname;
};

const changeNickname = (newNickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = newNickname;
};

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectado`);
  newUser(socket);
  console.log(users);
  io.emit('connected', nickGenerator());

  socket.on('message', ({ chatMessage, nickname }) => {
    addNickname(nickname, socket);
    const res = `${getTime()} ${getNickname(socket)} ${chatMessage}`;
    io.emit('message', res);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', users);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

httpServer.listen(3000);
