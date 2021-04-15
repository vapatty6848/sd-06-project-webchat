const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.use(express.json());
app.use(cors());
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use('/', express.static(path.join(__dirname, 'views')));

const { addMessages, getAllMessages } = require('./models/messages');

app.set('view engine', 'ejs');
app.set('views', './views');

const onlineUsers = [];

io.on('connection', (socket) => {
  const userId = socket.id;
  console.log(`User ${userId} connected.`);
  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected.`);
    delete onlineUsers[userId];
    io.emit('updateUser', { onlineUsers });
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const messageTime = new Date();
    await addMessages({ chatMessage, nickname, messageTime });
    const result = `${messageTime} - ${nickname} - ${chatMessage}`;
    io.emit('message', result);
  });
});

app.get('/', async (_req, res) => {
  const allMsgs = await getAllMessages();
  res.status(200).render('view', { onlineUsers, allMsgs });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
