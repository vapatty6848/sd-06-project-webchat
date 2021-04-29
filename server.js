const moment = require('moment');
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const port = process.env.PORT || 3000;

const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const { saveMsg, getAll } = require('./models/chatMsg');

app.use(cors());

function userDate() {
  const timeFormated = moment().format('DD-MM-yyyy h:mm:ss A');
  return timeFormated;
}

let randonUserLast = `user_${Math.random().toString().substr(2, 11)}`;
let users = [];

function newUserNickname({ newNickname, socket }) {
  const index = users.findIndex((user) => user.socketId === socket.id);
  const userIndex = users.splice(index, 1, { nickname: newNickname, socketId: socket.id });
  io.emit('updateUsers', users);
}

function newUser(nickname, socket) {
  randonUserLast = `user_${Math.random().toString().substr(2, 11)}`;
  const newUser = { socketId: socket.id, nickname };
  return users.push(newUser);
}

io.on('connection', (socket) => {
  socket.on('conectado', (nickname) => {
    newUser(nickname, socket);
    io.emit('updateUsers', users); // toda vez que atualizar ele envia
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    const times = userDate();
    io.emit('message', `${times} -  ${nickname}: ${chatMessage}`);
    saveMsg({ nickname, chatMessage, times });
  });
  socket.on('updateNickname', (newNickname) => {
    newUserNickname({ newNickname, socket });
  }); // cham a função de atuaização do nickname
  socket.on('disconnect', () => {
    const usersOn = users.filter((us) => us.socketId !== socket.id);
    users = usersOn;
    io.emit('updateUsers', users); // toda vez que atualiza envia
  });
});

app.set('view engine', 'ejs'); // cria
app.set('views', './views'); // local das paginas serem mostradas arquivos que vou quero enviar

app.get('/', async (_req, res) => {
  const listAll = await getAll();
  const randonUser = randonUserLast;

  res.render('home', { listAll, users, randonUser });
});

httpServer.listen(port, () => console.log(`${port}`));
