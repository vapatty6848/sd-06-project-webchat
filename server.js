const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
});

const users = [];

const addNewUser = (socket) => {
  const newUser = {
    id: socket.id,
  };
  users.push(newUser);
};

const addNickname = (nickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = nickname;
};

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
    .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

const changeNickname = (newNickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = newNickname;
};

const getNickname = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  console.log(users[index].nickname)
  return users[index].nickname;
};

const getRandomString = () => {
  const length = 16;
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  addNewUser(socket);
  console.log(users);
  io.emit('connected', getRandomString());

  socket.on('message', ({ chatMessage, nickname }) => {
    addNickname(nickname, socket);
    const response = `${getTime()} ${getNickname(socket)} ${chatMessage}`;
    io.emit('message', response);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', users);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

http.listen(3000, () => console.log('Ouvindo na porta 3000'));