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

const setNick = (socket, nick, userNick) => {
  changeNick(socket.id, nick);
  io.emit('updateUsers', users);
  socket.broadcast.emit(
    'message',
    { chatMessage: `${userNick} agora se chama ${nick}.`, userNick },
  );
  socket.emit(
    'message',
    { chatMessage: `Seu novo nick é: ${nick}.`, userNick },
  );
};

const sendMessage = (socket, { message }) => {
  const updatedNick = getNick(socket.id);
  io.emit(
    'message',
    { chatMessage: `${generateTimeStamp()} - ${updatedNick}: ${message}`, nickname: updatedNick },
  );
};

const userDisconnect = (socket, guestNumber) => {
  usedGuestNumbers = usedGuestNumbers.filter((number) => number !== guestNumber);
  const updatedNick = getNick(socket.id);
  removeUser(socket.id);
  io.emit('updateUsers', users);
  socket.broadcast.emit(
    'message',
    { chatMessage: `${updatedNick} acabou de se desconectar.`, nickname: updatedNick },
  );
};

io.on('connection', (socket) => {
  const guestNumber = newGuestNumber();
  users.push({ userId: socket.id, userNick: `Guest ${guestNumber}`, guestNumber });
  const userNick = getNick(socket.id);
  io.emit('updateUsers', users);
  socket.emit('welcome', { chatMessage: `Seja bem vindo ao nosso chat, ${userNick}!`, userNick });
  socket.broadcast.emit(
    'message',
    { chatMessage: `${userNick} acabou de se conectar.`, userNick },
  );

  socket.on('disconnect', () => userDisconnect(socket, guestNumber));
  socket.on('message', (chatMessage) => sendMessage(socket, chatMessage));
  socket.on('setNick', (nick) => setNick(socket, nick, userNick));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
