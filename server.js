const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  },
});

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  console.log(`Conectado: ${socket.id}`);

  socket.emit('hello', 'Seja bem vindo(a)');

  socket.broadcast.emit('messageServer', { 
    chatMessage: 'Alguém se conectou', 
  });

  socket.on('disconnect', () => {
    console.log('Desconectado');
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('messageServer', { chatMessage, nickname });
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});