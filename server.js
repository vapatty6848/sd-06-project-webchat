const express = require('express');

const cors = require('cors');

const app = express();

const httpServer = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

// adc o cors ainda
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

function newUserFunc(socket) {
  socket.on('newUser', (nickname) => {
    nick = nickname;
    users.push(nick);
    io.emit('updateUsers', users);
    // io.emit('nick', nickname);
  });
}

function messageFunc(socket) {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const message = { chatMessage, nickname };
    const newMessage = await chatModel.createMessage(message);
    io.emit('message', newMessage);
  });
}

function updateNickFunc(socket) {
  socket.on('updateNick', async (nickname, newNickname) => {
    await chatModel.updateNick(nickname, newNickname);
    const indexUser = users.findIndex((user) => user === nickname);
    users.splice(indexUser, 1, newNickname);
    nick = newNickname;
    io.emit('updateUsers', users);
  });
}

function disconnectFunc(socket) {
  socket.on('disconnect', () => {
    users = users.filter((user) => user !== nick);
    io.emit('updateUsers', users);
  });
}

io.on('connection', async (socket) => {
  console.log('SOCKET ID', socket.id);

  newUserFunc(socket);

  messageFunc(socket);

  updateNickFunc(socket);

  disconnectFunc(socket);
});

app.use('/', chatController);

// consultar aplicação do conteúdo de adc novo author e criar
// o controller para chamar aqui e retirar essa callback
// app.get('/', (req, res) => {
//   res.render('home');
// });

httpServer.listen(PORT, () => console.log('Ouvindo porta', PORT));
