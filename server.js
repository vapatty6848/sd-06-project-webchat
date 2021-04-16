const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const currentDateFormat = require('./utils/currentDateFormat');
const { getAll, uploadDB, deleteForIdSocket } = require('./models/mongoDbRequests');

const PORT = 3000;

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './view');

app.get('/', async (_req, res) => {
  const arrayMessages = await getAll('messages');
  const arrayUsersOn = await getAll('usersOn');
  console.log('arrayUsersOn', arrayUsersOn);
  res.render('./chat', { arrayMessages, arrayUsersOn });
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('Desconectado');
    deleteForIdSocket('usersOn', socket.id);
    // socket.broadcast.emit('userOff', );
  });

  socket.on('userOn', (nickname) => {
    uploadDB('usersOn', { nickname, idSocket: socket.id });
    socket.broadcast.emit('usersOn', nickname);
  });

  socket.on('message', (msg) => {
    console.log(`Mensagem ${msg}`);
    const { nickname, chatMessage } = msg;

    const currentDate = currentDateFormat();

    uploadDB('messages', { currentDate, nickname, chatMessage });
    
    io.emit('messageCli', `${currentDate} - ${nickname}: ${chatMessage}`);
  });
});

app.use((err, _req, res, _next) => {
  console.error({ err });
  res.status(500).json({ erro: 'erro interno' });
});

http.listen(PORT, () => {
  console.log('Servidor ouvindo na porta ', PORT);
});
