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

const messagesModel = require('./models/messagesModel');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());

app.get('/', async (req, res) => {
  const history = await messagesModel.getAllMessages();
  console.log('Cade o history?', history);
  res.render('home', { history });
});

const now = new Date();
const fullData = String(dateFormat(now, 'dd-mm-yyyy HH:MM:ss TT'));
console.log(fullData);

/* const users = []; */
io.on('connection', (socket) => {
  console.log('Novo usuário conectado');

  socket.on('message', async ({ nickname, chatMessage }) => {
    console.log(nickname);
    io.emit('message', `${fullData} - ${nickname}: ${chatMessage}`);
    messagesModel.createHistory(nickname, chatMessage, fullData);
  });

  socket.on('newUser', (nickname) => {
    socket.emit('nickname', nickname);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} se desconectou!`);
  });
});

httpServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});