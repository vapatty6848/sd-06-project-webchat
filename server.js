const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const msgControler = require('./controller/msgController');

  const users = [];

io.on('connection', (socket) => {
  socket.on('nickName', (nickname) => {
    const userObj = { name: nickname, socketId: socket.id };
    users.push(userObj);
    io.emit('updateUsers', users);
    socket.emit('yourNick', nickname);
  });
    socket.on('disconnect', () => {
    const userId = users.findIndex((el) => el.socketId === socket.id);
    if (userId >= 0) { users.splice(userId, 1); }
    socket.broadcast.emit('updateUsers', users);
  });
  socket.on('message', (message) => {
    const data = new Date();
    const time = `${data.getDate()}-${(data.getMonth() + 1)}-${data.getFullYear()}`
    + `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
     const fullMsg = `${time} - ${message.nickname}: ${message.chatMessage}`;
     io.emit('message', fullMsg);
  });
});

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs'); // caminha para o eja renderizar uma pg.
app.set('views', './views');

app.use(express.urlencoded({ extend: true }));
app.use(express.json());
app.get('/', (_req, res) => {
  res.render('home');
});
app.post('/ready', msgControler);

httpServer.listen(3000, () => console.log('socket.io ouvindo na port 3000'));