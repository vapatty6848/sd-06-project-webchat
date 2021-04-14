const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const users = [];

io.on('connection', (socket) => {
  console.log(`Usuário novo conectado ${socket.id}`);

  users.push({ socketId: socket.id });

  io.emit('updateUsers', users);

  socket.on('sentMessage', (message) => { // 2. aqui no back ele capta o que foi escrito no canal sentMessage lá do front
    console.log(message);
    io.emit('newMessage', message); // 3. aqui meu back, emit a mensagem captada no canal sentMessage para todos os usuarios conectados e cria outro canal, o newMessage que pode ser captado pelo front
  });

  socket.on('disconnect', () => {
    console.log(`Usuário ${socket.id} desconectado`);
    // io.emit('newMessage', `Usuário no socket ${socket.id} se desconectou`);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('homeView');
});

httpServer.listen('3000');
