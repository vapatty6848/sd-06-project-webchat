const express = require('express');

const app = express();
const { urlencoded } = require('express');
const httpServer = require('http').createServer(app);
const moment = require('moment');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { createMessage } = require('./models/messageModel');
const { changeUser, sendMsg } = require('./services/services');
const messageController = require('./controllers/messageController');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', messageController);

app.use(express.json());
app.use(urlencoded({ extended: false }));

const users = [];

io.on('connection', (socket) => {
  socket.on('newUser', (user) => {
    users.push({ socketId: socket.id, userName: user });
    io.emit('updateUsers', users);
  });

  socket.on('disconnect', () => {
    changeUser(socket, users);
    io.emit('updateUsers', users);
  });

  socket.on('message', async (obj) => {
    const date = moment().format('DD-MM-yyyy hh:mm:ss');
    await createMessage({ ...obj, timestamp: moment().format('yyyy-MM-DD hh:mm:ss') });
    io.emit('message', sendMsg(obj, date));
  });

  socket.on('changeUser', (newNickname) => {
    changeUser(socket, users);
    users.push({ socketId: socket.id, userName: newNickname });
    io.emit('updateUsers', users);
  });
});

httpServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
