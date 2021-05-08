const app = require('express')();

const http = require('http').createServer(app);

const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { formatDate } = require('./functions');

app.use(cors());

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  console.log('Conectado');
  socket.on('message', (message) => {
    console.log('Mensagem enviada');
    io.emit('messageData', `${formatDate()} - ${message.nickname}: ${message.chatMessage}`);
  });
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});