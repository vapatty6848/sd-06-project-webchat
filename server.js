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

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  // res.render(path.join(__dirname, '/views/index'));
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

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  addNewUser(socket);
  console.log(users);
  io.emit('connected', randomNickname());
  socket.on('message', ({ chatMessage, nickname }) => {
    addNickname(nickname, socket);
    const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss TT');
    const response = `${dateTime} ${getNickname(socket)} ${chatMessage}`;
    io.emit('message', response);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', users);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
});

httpServer.listen(3000, () => console.log('Na porta 3000'));
