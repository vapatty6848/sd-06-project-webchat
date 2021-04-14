const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('../view/');
});

const users = [];

io.on('connection', (socket) => {
  const id = users.length;
  let nickname = `12345678910111d${users.length}`;
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

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});