const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const utils = require('./utils');

app.use(cors());
app.use('/styles', express.static(path.join(__dirname, 'views', 'styles')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.status(200).render('index');
});

io.on('connection', (socket) => {
  console.log('Usuário conectado ao chat.');

  socket.on('clientMessage', (msg) => {
    console.log(`Mensagem: ${msg}`);
    const date = new Date();
    const timestamp = `${utils.formatTimestamp(date)}`;

    const chatMessage = `${timestamp} - ${msg.nickname}: ${msg.chatMessage}`;
    io.emit('message', { nickname: msg.nickname, chatMessage });
  });

  socket.on('disconnect', () => {
    console.log('Usuário saiu do chat.');
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
