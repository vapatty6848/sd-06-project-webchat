const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
 cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { urlencoded } = require('express');
const { historicModel } = require('./models');
const { ChatController } = require('./controllers');
const { ChatUtils } = require('./utils');

const PORT = process.env.PORT || 3000;
let users = [];

const formatMessage = (msg) => {
  const { chatMessage: message, nickname } = msg;
  const timestamps = ChatUtils.generateData();
  const dataMsg = { message, nickname, timestamps };
  historicModel.create(dataMsg);
  const messageFormat = `${timestamps} - ${nickname}: ${message}`;
  return messageFormat;
};

io.on('connection', (socket) => {
console.log(`${socket.id}, Conectou`);

  socket.on('NewUser', (user) => {
    users.unshift({ id: `${socket.id}`, name: user });
    io.emit('usersNick', users);
});
  socket.on('message', (message) => {
    io.emit('message', formatMessage(message));
  });

  socket.on('newNick', (user) => {
    users = ChatUtils.updateUsers(users, user);  
    io.emit('usersNick', users);
  });

  socket.on('disconnect', () => {
    ChatUtils.removeUser(users, socket);
    io.emit('usersNick', users);
    console.log(`${socket.id}, Desconectou`);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/', ChatController);
app.use(express.static(path.join(__dirname, 'utils')));

httpServer.listen(PORT, () => console.log(`Escutando a porta ${PORT}`));
