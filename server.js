// Faça seu código aqui
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

const PORT = 3000;

app.use(cors());

app.get('/', (_req, res) => {
  const pathname = path.join(__dirname, 'views', '/index.html');
  res.sendFile(pathname);
});

io.on('connection', (socket) => {
  console.log('Conectado');
  socket.emit('Hello!');
  socket.broadcast.emit('mensagemServer', { mensagem: 'Usuário conectado!' });
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
  socket.on('mensagem', (msg) => {
    io.emit('mensagemServer', { mensagem: msg });
    console.log(`Mensagem ${msg}`);
  });
});

http.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});