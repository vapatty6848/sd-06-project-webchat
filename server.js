const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/views/`));

app.get('/', (_req, res) => {
  res.render('home');
});

const allUsers = [];

const addNewUser = ({ socket, nickname }) => {
  allUsers.push({ id: socket.id, nickname });
  io.emit('updatOnlineUsers', allUsers);
};

const changeNickname = ({ newNickname, socket }) => {
  allUsers.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });

    return user;
  });

  io.emit('updateOnlineUsers', allUsers);
};

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
    .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

io.on('connection', async (socket) => {
  console.log('novo usuario conectado');
  socket.on('newUser', ({ nickname }) => addNewUser({ socket, nickname }));
});

httpServer.listen(PORT, () => {
  console.log(`Servindo na porta ${PORT}`);
});
