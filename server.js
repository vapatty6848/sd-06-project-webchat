const express = require('express');

const app = express();

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
const webChatController = require('./controllers/webChatController');

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(express.static(`${__dirname}/views/`));

app.use('/', webChatController);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});