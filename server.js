const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const models = require('./models/messages');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const messagesFormatter = ({ nickname, chatMessage, timestamp }) => {
  const formattedMessage = `${timestamp} - ${nickname} disse: ${chatMessage}`;

  return formattedMessage;
};

app.get('/', async (_req, res) => {
  const previousMessages = await models.getMessages();
  const messagesToRender = previousMessages.map((message) => messagesFormatter(message));
  return res.render('home', { messagesToRender });
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

const setNick = (socket, nickname, userNick) => {
  changeNick(socket.id, nickname);
  io.emit('updateUsers', users);
  socket.broadcast.emit('message', `${userNick} agora se chama ${nickname}.`);
  socket.emit('message', `Seu novo nick é: ${nickname}.`);
};

const sendMessage = async ({ chatMessage, nickname }) => {
  const timestamp = generateTimeStamp();
  const message = messagesFormatter({ nickname, chatMessage, timestamp });

  await models.saveMessages({ nickname, chatMessage, timestamp });
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
  socket.on('setNick', ({ nickname, userNick }) => setNick(socket, nickname, userNick));
});

httpServer.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
