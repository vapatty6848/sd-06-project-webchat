const express = require('express');
const cors = require('cors');
require('dotenv').config();

const currentDateFormat = require('./utils/currentDateFormat')

const { getAll, uploadDB } = require('./models/mongoDbRequests')

const app = express();

const PORT = 3000;

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './view')

const http = require('http').createServer(app);

app.get('/', async (_req, res) => {
  const arrayMessages = await getAll('messages');
  console.log('arrayMessages 1', arrayMessages)
  res.render('./chat', { arrayMessages });
});

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    console.log('Desconectado');
  });

  socket.on('userOn', (userOn) => {
    socket.broadcast.emit('usersOn', userOn.nickname);
  })

  socket.on('message', (msg) => {
    console.log(`Mensagem ${msg}`);
    const { nickname, chatMessage } = msg;

    const currentDate = currentDateFormat();

    uploadDB('messages', { currentDate, nickname, chatMessage })
    
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
