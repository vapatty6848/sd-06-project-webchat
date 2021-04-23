const express = require('express');
const cors = require('cors');
const httpServer = require('http');
const socketIo = require('socket.io');

const app = express();
const http = httpServer.createServer(app);
const io = socketIo(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/server.html`);
});

let users = [];

const generateTimeStamp = () => {
  const dateOptions = Intl.DateTimeFormat(
    'en-gb',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
  ).formatToParts(new Date());
  const dateParts = {};

  dateOptions.forEach(({ type, value }) => {
    dateParts[type] = value;
  });

  const { day, month, year, hour, minute, second } = dateParts;

  return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
};

const getNick = (socketId) => {
  const userFound = users.find(({ userId }) => socketId === userId);
  if (userFound) return userFound.userNick;
};

const changeNick = (socketId, nick) => {
  users.forEach((user, index) => {
    if (socketId === user.userId) {
      users[index].userNick = nick;
    }
  });
};

const removeUser = (socketId) => {
  users = users.filter(({ userId }) => socketId !== userId);
};

const setNick = (socket, nick, userNick) => {
  changeNick(socket.id, nick);
  io.emit('updateUsers', users);
  socket.broadcast.emit('message', `${userNick} agora se chama ${nick}.`);
  socket.emit('message', `Seu novo nick é: ${nick}.`);
};

const sendMessage = ({ chatMessage, nickname }) => {
  const message = `${generateTimeStamp()} - ${nickname} disse: ${chatMessage}`;

  io.emit('message', message);
};

const userDisconnect = (socket) => {
  const updatedNick = getNick(socket.id);

  removeUser(socket.id);
  io.emit('updateUsers', users);
  socket.broadcast.emit('message', `${updatedNick} acabou de se desconectar.`);
};

const loginUser = ({ nickname, socket }) => {
  users.push({ userId: socket.id, userNick: nickname });
  io.emit('updateUsers', users);
};

io.on('connection', (socket) => {
  socket.on('login', ({ nickname }) => loginUser({ nickname, socket }));
  socket.on('message', ({ chatMessage, nickname }) => sendMessage({ chatMessage, nickname }));
  socket.on('disconnect', () => userDisconnect(socket));
  socket.on('setNick', (nick) => setNick(socket, nick));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
