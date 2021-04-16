const app = require('express')();
const httpServer = require('http').createServer(app);
const dateFormat = require('dateformat');

// const path = require('path');
const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const model = require('./models/message');
const controller = require('./controller/controller');

app.use(cors());
app.use('/', controller);
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  // res.render(path.join(__dirname, '/views/index'));
  res.render('index');
});

const users = [];

const addNewUser = (socket, nickname) => {
  const newUser = {
    id: socket.id,
    nickname,
  };
  users.push(newUser);
};

const addNickname = (nickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = nickname;
};

const changeNickname = (newNickname, socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users[index].nickname = newNickname;
};

const getNickname = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  return users[index].nickname;
};

const randomNickname = () => {
  const size = 16;
  const randomCharacters = 'ABCDefghiJKLmNoPQRStuv125478963';
  let randomic = '';
  for (let i = 0; i < size; i += 1) {
    randomic += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
  }
  return randomic;
};

const removeDisconnected = (socket) => {
  const index = users.findIndex((user) => user.id === socket.id);
  users.splice(index, 1);
};

io.on('connection', (socket) => {
  const stringNickname = randomNickname();
  addNewUser(socket, stringNickname);
  socket.broadcast.emit('connected', stringNickname);
  socket.emit('userConnected', { stringNickname, users });
  socket.on('message', async ({ chatMessage, nickname }) => {
    addNickname(nickname, socket);
    const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss TT');
    const response = `${dateTime} ${getNickname(socket)} ${chatMessage}`;
    io.emit('message', response);
    await model.createMessage(chatMessage, getNickname(socket), dateTime);
  });
  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', users);
  });
  socket.on('disconnect', () => {
    removeDisconnected(socket);
  });
});

httpServer.listen(3000, () => console.log('Na porta 3000'));
