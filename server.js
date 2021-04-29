// Faça seu código aqui
const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST, GET'],
  },
});
const viewConnection = require('./models/viewConnection');

const PORT = process.env.PORT || 3000;

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', async (req, res) => res.render('index'));

const getDate = () => {
//   const date = new Date().getTime();
//   const parseDate = new Date(date).toLocaleDateString();
  const date = new Date();
  const parseMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const parseDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const parseDate = { year: date.getFullYear(), month: parseMonth, day: parseDay };
  return parseDate;
};

const getHour = () => {
  const time = new Date();
  const parseHour = time.getHours() - 12;
  const parseMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const parseSeconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds();
  let code = 'PM';
  if (parseHour < 0) {
    code = 'AM';
    const hour = `${time.getHours()}:${parseMinutes}:${parseSeconds} ${code}`;
    return hour;
  }
  if (parseHour === 0) {
    const hour = `${time.getHours()}:${parseMinutes}:${parseSeconds} ${code}`;
    return hour;
  }
  const hour = `${parseHour}:${parseMinutes}:${parseSeconds} ${code}`;
  return hour;
};

const connectedUser = [];

const allMessages = async () => {
  await viewConnection.getMessages().then((resp) => io.emit('listMessages', resp));
};

const insertMsg = async (message, date) => {
  await viewConnection.insertMessage({
    message: message.chatMessage,
    nickname: message.nickname,
    timestamp: `${date.year}-${date.month}-${date.day} ${getHour()}`,
  });
};

const socketMessage = (socket) => {
  socket.on('message', async (message) => {
    const date = getDate();
    const parseDate = `${date.day}-${date.month}-${date.year}`;
    const msg = `${parseDate} ${getHour()} ${message.nickname}: ${message.chatMessage}`;
    insertMsg(message, date);
    io.emit('message', msg, message, socket.id);
  });
};

io.on('connection', (socket) => {
  let randomId = socket.id.substring(0, 16);
  connectedUser.push(randomId);
  io.emit('usersOnline', connectedUser);
  socket.emit('initial', randomId);
  allMessages();
  socket.on('editNickName', (newNickName) => {
    connectedUser.splice(connectedUser.indexOf(randomId), 1, newNickName);
    randomId = newNickName;
    console.log('novo nickname', randomId);
    io.emit('usersOnline', connectedUser);
  });
  socket.on('disconnect', () => {
    console.log(randomId, 'saiu');
    connectedUser.splice(connectedUser.indexOf(randomId), 1);
    io.emit('usersOnline', connectedUser);
  });
  socketMessage(socket);
});

http.listen(PORT, () => console.log(`ouvindo na porta: ${PORT}`));
