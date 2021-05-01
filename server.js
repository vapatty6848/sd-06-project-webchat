const express = require('express');
const cors = require('cors');
const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/chatController');

app.use(cors());

app.use('/styles', express.static(path.join(__dirname, 'views', 'styles')));

app.set('view engine', 'ejs');
app.set('views', './views');

const users = [];

app.get('/', async (_req, res) => {
  const allmessages = await chatController.getMessages();
  res.render('index', { allmessages });
});

const formateDate = () => {
  const date = new Date().toISOString();
  const ano = date.split('-')[0];
  const mes = date.split('-')[1];
  const dia = date.split('-')[2].slice(0, 2);
  const horario = new Date().toString().slice(16, 24);
  return `${dia}-${mes}-${ano} ${horario}`;
};

io.on('connection', async (socket) => {
  socket.on('newUser', async (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('updateUsers', users);
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    io.emit('message', `${formateDate()} - ${nickname}: ${message}`);
    await chatController.createMessages(formateDate(), nickname, message);
  });

  socket.on('newNickname', (newNick) => {
    const index = users.findIndex((item) => item.id.includes(socket.id));
    users[index].nickname = newNick;

    io.emit('updateUsers', users);
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((item) => item.id.includes(socket.id));
    users.splice(index, 1);

    io.emit('updateUsers', users);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});