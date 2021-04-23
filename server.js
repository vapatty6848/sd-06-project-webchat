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

// array de usuários
const users = [];
// função user aleatorio.
const getFisrtUser = (socket) => {
  const randomUser = (`${Math.random().toString(36)}00000000000000000`).slice(2, 16 + 2);
  const objUser = { name: randomUser, socketId: socket.id };
  users.push(objUser);
  socket.emit('withoutNick', randomUser);
  io.emit('updateUsers', users);
};
// função update user com nickName
const updateNickame = (socket) => {
  socket.on('nickName', (nickname) => {
    const userObj = { name: nickname, socketId: socket.id };
    const userId = users.findIndex((el) => el.socketId === socket.id);
    if (userId >= 0) { users.splice(userId, 1); }
    users.push(userObj);
    io.emit('updateUsers', users);
    socket.emit('yourNick', nickname);
  });
};
// função mandar msg com nick
const sendMsgNick = (socket) => {
  socket.on('message', (message) => {
    console.log('back', message);
    const data = new Date();
    const time = `${data.getDate()}-${(data.getMonth() + 1)}-${data.getFullYear()}`
    + `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
     const fullMsg = `${time} - ${message.nickname}: ${message.chatMessage}`;
     io.emit('message', fullMsg);
  });
};
// função mandar msg sem nick
const sendMsg = (socket) => {
  socket.on('msg', (objMsg) => {
    console.log('back', objMsg);
    const data = new Date();
    const time = `${data.getDate()}-${(data.getMonth() + 1)}-${data.getFullYear()}`
    + `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
     const fullMsg = `${time} - ${objMsg.nickname}: ${objMsg.chatMessage}`;
     io.emit('messageSnick', fullMsg);
  });
};
//  função desconectar user.
const disconnect = (socket) => {
  socket.on('disconnect', () => {
    const userId = users.findIndex((el) => el.socketId === socket.id);
    if (userId >= 0) { users.splice(userId, 1); }
    socket.broadcast.emit('updateUsers', users);
  });
};
io.on('connection', (socket) => {
  getFisrtUser(socket);
  updateNickame(socket);
  disconnect(socket);
  sendMsgNick(socket);
  sendMsg(socket);
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