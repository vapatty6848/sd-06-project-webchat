// Faça seu código aqui
const express = require('express');

const app = express();
const PORT = 3000;
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// const { addMessages } = require('./models/messages');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  res.render('../views/');
});

const users = [];

io.on('connection', (socket) => {
  const id = users.length;
  let nickname = `98765432110111d${users.length}`;
  if (nickname.length > 16) nickname = `2345678910111d${users.length}`;
  users.push(nickname);
  console.log(users);

  socket.emit(nickname);

  socket.on('mensagem', (msg) => {
    const date = new Date();
    const formatedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    const formatedTime = `${date.getHours()}:${date.getMinutes()}`;
    io.emit('mensagemServer', `${formatedDate} ${formatedTime} ${users[id]}: ${msg}`);
  });

  socket.on('user', (user) => {
    users[id] = user || nickname;
    io.emit('userServer', users[id]);
  });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});