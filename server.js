/* eslint-disable max-lines-per-function */
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
let usedGuestNumbers = [];

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
      hour12: true,
    },
  ).formatToParts(new Date());
  const dateParts = {};
  dateOptions.forEach(({ type, value }) => {
    dateParts[type] = value;
  });
  const { day, month, year, hour, minute, second, dayPeriod } = dateParts;
  return `${day}/${month}/${year} ${hour}:${minute}:${second} ${dayPeriod}`;
};

const newGuestNumber = () => {
  if (usedGuestNumbers.includes(1)) {
    let newNumber = 2;
    for (let i = 2; usedGuestNumbers.includes(i); i += 1) {
      newNumber = i + 1;
    }
    usedGuestNumbers.push(newNumber);

    return newNumber;
  }
  usedGuestNumbers.push(1);
  return 1;
};

const getNick = (socketId) => {
  const userFound = users.find(({ userId }) => socketId === userId);
  return userFound.userNick;
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

io.on('connection', (socket) => {
  const guestNumber = newGuestNumber();
  users.push({ userId: socket.id, userNick: `Guest ${guestNumber}`, guestNumber });
  const userNick = getNick(socket.id);
  io.emit('updateUsers', users);
  socket.emit('welcome', `Seja bem vindo ao nosso chat, ${userNick}!`);
  socket.broadcast.emit(
    'message',
    { message: `${userNick} acabou de se conectar.` },
  );

  socket.on('disconnect', () => {
    usedGuestNumbers = usedGuestNumbers.filter((number) => number !== guestNumber);
    removeUser(socket.id);
    io.emit('updateUsers', users);
    socket.broadcast.emit(
      'message',
      { message: `${userNick} acabou de se desconectar.` },
    );
  });

  socket.on('message', ({ chatMessage }) => {
    io.emit('message', { message: `${generateTimeStamp()} - ${userNick}: ${chatMessage}` });
  });

  socket.on('setNick', (nick) => {
    changeNick(socket.id, nick);
    io.emit('updateUsers', users);
    socket.broadcast.emit(
      'message',
      { message: `${userNick} agora se chama ${nick}.` },
    );
    socket.emit(
      'message',
      { message: `Seu novo nick é: ${nick}.` },
    );
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
