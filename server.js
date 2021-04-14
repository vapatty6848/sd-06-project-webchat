// Faça seu código aqui
const express = require('express');

const app = express();
const PORT = 3000;
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { addMessages } = require('./models/messages');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  res.render('../views/');
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected.`);
  socket.on('disconnect', () => console.log(`User ${socket.id} disconnected.`));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const messageTime = new Date();
    await addMessages({ chatMessage, nickname, messageTime });
    const result = `${messageTime} - ${nickname} - ${chatMessage}`;
    io.emit('message', result);
  });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});