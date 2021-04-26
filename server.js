const express = require('express');

const cors = require('cors');

const app = express();

const httpServer = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const chatController = require('./controllers/chatController');
const chatModel = require('./models/chatModel');

app.set('view engine', 'ejs');
app.set('views', './views');

let users = [];
let nick;
console.log('USER FORA DAS FUNCOES', users);

function newUserFunc(socket) {
  console.log('conectando', socket.id);
  console.log('novo usuario conectado');
  socket.on('newUser', (nickname) => {
    nick = nickname;
    console.log('NICKNAME DE PARAMETRO', nickname);
    console.log('USERS ANTES', users);
    users.push({ nick, id: socket.id });
    console.log('USERS DEPOIS', users);
    io.emit('updateUsers', users);
  });
}

function messageFunc(socket) {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const message = { chatMessage, nickname, id: socket.id };
    const newMessage = await chatModel.createMessage(message);
    io.emit('message', newMessage);
  });
}

function updateNickFunc(socket) {
  socket.on('updateNick', async (nickname, newNickname) => {
    await chatModel.updateNick(nickname, newNickname);
    const indexUser = users.findIndex((user) => user.nick === nickname);
    users.splice(indexUser, 1, { nick: newNickname, id: socket.id });
    nick = newNickname;
    io.emit('updateUsers', users);
  });
}

function disconnectFunc(socket) {
  console.log('desconectando', socket.id);
  socket.on('disconnect', () => {
    users = users.filter((user) => user.nick !== nick);
    io.emit('updateUsers', users);
  });
}

io.on('connection', async (socket) => {
  console.log('SOCKET ID novo usuario', socket.id);

  newUserFunc(socket);

  messageFunc(socket);

  updateNickFunc(socket);

  disconnectFunc(socket);
});

app.use('/', chatController);

httpServer.listen(PORT, () => console.log('Ouvindo porta', PORT));
