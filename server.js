const cors = require('cors');
const express = require('express');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);

app.use(cors());

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let users = [];
const messageDate = moment().format('DD-MM-YYYY hh:mm:ss A');

const randomNickname = () => {
  const length = 16;
  const characteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characteres.charAt(Math.floor(Math.random() * characteres.length));
  }
  return result;
};

io.on('connection', (socket) => {
  socket.on('connected', (nickname) => {
    users.push({ nickname, sokectId: socket.id });
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const editedMessage = `${messageDate} - ${nickname}: ${chatMessage}`;
    console.log(editedMessage);
    io.emit('message', editedMessage);
  });

  // Canal reservado
  socket.on('disconnect', () => {
    users = users.filter((user) => user.sokectId !== socket.id);
  });
});

app.set('view engine', 'ejs'); // Cria uma view do lado do servidor, usando um ejs que é um view engine(motor de criação);
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home', { nickname: randomNickname(), users });
});

httpServer.listen('3000');
