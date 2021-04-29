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

// const socketEdit = () => {
  
// }

io.on('connection', (socket) => {
  socket.id = socket.id.substring(0, 16);
  connectedUser.push(socket.id);
  io.emit('usersOnline', connectedUser);
  socket.emit('initial', socket.id);
  allMessages();
  socket.on('disconnect', () => {
    connectedUser.splice(connectedUser.indexOf(socket.id), 1);
    io.emit('usersOnline', connectedUser);
  });
  socket.on('editNickName', (newNickName) => {
    connectedUser.splice(connectedUser.indexOf(socket.id), 1, newNickName);
    socket.id = newNickName;
    io.emit('usersOnline', connectedUser, socket.id);
  });
  socket.on('message', async (message) => {
    const date = getDate();
    const msg = `${date.day}-${date.month}-${date.year} ${getHour()} ${message.nickname}: ${message.chatMessage}`;
    insertMsg(message, date);
    io.emit('message', msg, message, socket.id);
  });
});

http.listen(PORT, () => console.log(`ouvindo na porta: ${PORT}`));
