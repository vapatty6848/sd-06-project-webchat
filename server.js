// Faça seu código aqui
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const { createMessage } = require('./models/messages');

const PORT = 3000;

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
    const timestamp = moment().format('DD-MM-YYYY hh:mm:ss A');
    await createMessage({ chatMessage, nickname, timestamp });
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
