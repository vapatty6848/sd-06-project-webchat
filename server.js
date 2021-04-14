const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');

const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(cors());

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '/views/index.html');
  res.sendFile(htmlPath);
});

io.on('connection', (socket) => {
  console.log('Conectado');

  socket.emit('ola', 'Que bom que você chegou aqui! Fica mais um cadin, vai ter bolo :)');

  socket.broadcast
    .emit('mensagemServer', { mensagem: ' Iiiiiirraaaa! Fulano acabou de se conectar :D' });

  socket.on('disconnect', () => {
    console.log('Desconectado');
  });

  socket.on('mensagem', (msg) => {
    io.emit('mensagemServer', { mensagem: msg });
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});
