const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  },
});

const { messageFormat } = require('./utils');

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

io.on('connection', (socket) => {
  console.log(`${socket.id} conectou!`);

  socket.emit('hello', 'Seja bem vindo(a)');

  // socket.broadcast.emit('message', message({ chatMessage: 'se conectou', nickname: socket.id }));

  socket.on('disconnect', () => console.log('Desconectado'));

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', messageFormat({ chatMessage, nickname }));
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});