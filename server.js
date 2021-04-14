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

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const users = [];

io.on('connection', (socket) => {
  const nickname = `Pessoa ${users.length}`;
  socket.nickname = nickname;
  users.push(socket.nickname);

  socket.on('mensagem', (msg) => {
    console.log(socket.nickname);
    const date = new Date();
    const formatedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    const formatedTime = `${date.getHours()}:${date.getMinutes()}`
    io.emit('mensagemServer', `${formatedDate} ${formatedTime} ${socket.nickname}: ${msg}`);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});