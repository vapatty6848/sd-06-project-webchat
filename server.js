// Faça seu código aqui
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const dateFormat = require('dateformat');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { createMessage, getAllMessages } = require('./models/message');

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(cors());

io.on('connection', (socket) => {
  console.log(`Conectado ${socket.id}`);

  io.emit('conectado', `${socket.id}`);

  socket.on('message', async ({ nickname, message }) => {
    const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss TT');
    await createMessage(nickname, message, dateTime);
    const newMessage = `${dateTime} - ${nickname}: ${message}`;
    io.emit('message', newMessage);
  });

  // socket.on('disconnect', () => {
  //   console.log(`${socket.id} desconectado`);
  // });
});

app.get('/', async (req, res) => {
  const allMessages = await getAllMessages();
  res.status(200).render('index', { allMessages });
});

httpServer.listen(3000, () => {
  console.log('Servidor na porta 3000');
});
