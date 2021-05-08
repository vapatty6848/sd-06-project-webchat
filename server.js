const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const dateFormat = require('dateformat');

const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());

app.get('/', (req, res) => {
  res.render('home');
});

const now = new Date();
const fullData = String(dateFormat(now, 'dd-mm-yyyy HH:MM:ss TT'));
console.log(fullData);

/* const users = []; */
io.on('connection', (socket) => {
  console.log('Novo usuário conectado');

  socket.on('message', ({ nickname, chatMessage }) => {
    console.log(nickname);
    io.emit('message', `${fullData} - ${nickname}: ${chatMessage}`);
  });

  /* socket.emit('newUser', (user) => {
    const nickname = String(socket.id).slice(0, 16);
    users.push(nickname);
  }); */

  socket.on('disconnect', () => {
    console.log(`${socket.id} se desconectou!`);
  });
});

httpServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});