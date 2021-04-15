const express = require('express');
const cors = require('cors');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
      origin: 'https://localhost3000',
      methods: ['GET', 'POST'],
    },
  });

app.use(cors());

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/client.html');
// });

io.on('connection', (socket) => {
  console.log('usuário conectado');

  socket.on('disconnect', () => {
    console.log(
      'usuário desconectado'
    );
});

http.listen(3000, () => console.log('Servidor na porta 3000'));
