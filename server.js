const express = require('express');

const app = express();
const cors = require('cors');
const crypto = require('crypto');

app.use(cors());

app.set('view engine', 'ejs'); // Informa para o app que será utilizado ejs para montar a página.

app.set('views', './views');

const PORT = 3000;

const http = require('http').createServer(app);

const dateFormat = require('dateformat');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.get('/', async (_request, response) => {
  response.render('../views/');
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected.`);
  const randomNickName = crypto.randomBytes(8).toString('hex');
  socket.emit('connected', randomNickName);

  socket.on('message', async ({ nickname, chatMessage }) => {
    const dateTimeStamp = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
    const message = `${dateTimeStamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected.`);
  });
});

http.listen(PORT, () => {
  console.log(`Server has been started on Port ${PORT}.`);
});