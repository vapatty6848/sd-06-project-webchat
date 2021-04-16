const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { urlencoded } = require('express');
const { sendMessage } = require('./utils/serverUtils');
const MessageController = require('./controllers/MessageController');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', MessageController);

app.use(express.json());
app.use(urlencoded({ extended: false }));

const users = [];

io.on('connection', (socket) => {
  socket.on('newUser', (user) => {
    users.push({ socketId: socket.id, userName: user });
    io.emit('updateUsers', users);
  });

  socket.on('message', (obj) => {
    const date = moment().format('DD-MM-yyyy hh:mm:ss');
    io.emit('message', sendMessage(obj, date));
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) return users.splice(index, 1);
  });

  socket.on('changeUser', (newUserName) => {
    const index = users.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) users.splice(index, 1);
    users.push({ socketId: socket.id, userName: newUserName });
    io.emit('updateUsers', users);
  });
});

httpServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
