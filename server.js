const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors());

app.set('view engine', 'ejs'); // Informa para o app que será utilizado ejs para montar a página.

app.set('views', './views');

const PORT = 3000;

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.get('/', (request, response) => {
  response.render('../views/');
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected.`);
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected.`);
  });
});

http.listen(PORT, () => {
  console.log(`Server has been started on Port ${PORT}.`);
});