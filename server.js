const express = require('express');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);

const port = 3000;
app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(httpServer, {
  // configuracoes do cors
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

const clients = [];

const addNewUser = (socket) => {
  const newUser = {
    id: socket.id,
  };
  clients.push(newUser);
};

const addNickname = (nickname, socket) => {
  const index = clients.findIndex((user) => user.id === socket.id);
  clients[index].nickname = nickname;
};

const changeNickname = (newNickname, socket) => {
  const index = clients.findIndex((user) => user.id === socket.id);
  clients[index].nickname = newNickname;
};

const getNickname = (socket) => {
  const index = clients.findIndex((user) => user.id === socket.id);
  console.log(clients[index].nickname);
  return clients[index].nickname;
};

const getRandomChars = () => {
  const length = 16;
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
    .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

// escuta nova conexão
io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectado`);
  addNewUser(socket);
  console.log(clients);
  io.emit('connected', getRandomChars());
// escuta messagens
socket.on('message', ({ chatMessage, nickname }) => {
  addNickname(nickname, socket);
  const result = `${getTime()} ${getNickname(socket)} ${chatMessage}`;
  io.emit('message', result);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    changeNickname(newNickname, socket);
    io.emit('changeNickname', clients);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

app.get('/', (req, res) => res.render('index'));

httpServer.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`);
});
