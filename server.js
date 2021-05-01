const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const addLeftZero = (number) => {
  const param = number.toString();
  if (param.length < 2) { return `0${number}`; }
  return number;
};

const formatHours = (now) => {
  const hours = parseInt(now.getHours(), 10);
  const min = addLeftZero(now.getMinutes());
  const sec = addLeftZero(now.getSeconds());
  if (hours > 12) { return `${hours - 12}:${min}:${sec} PM`; }
  return `${now.getHours()}:${min}:${sec} AM`;
};

let onChat = [];

app.use(cors());

io.on('connection', (socket) => {
  const tagId = socket.id;
  const randomNickName = tagId.toString().substr(0, 16);
  const conex = { tagId, randomNickName };
  onChat.push(conex);
  // console.log(conex, onChat);
  io.emit('conex', conex);
  });

  io.on('connect', (socket) => {
  socket.on('alterNickName', (newUser) => {
    io.emit('alterNickName', newUser);
  });
  
  socket.on('message', (info) => {
    const now = new Date();
    const dat = `${addLeftZero(now.getDate())}-${addLeftZero(now.getMonth())}-${now.getFullYear()}`;
    const msg = `${dat} ${formatHours(now)} - ${info.nickname}: ${info.chatMessage}`;
    io.emit('message', msg);
  });
  
  socket.on('disconnect', () => {
    const del = socket.id;
    onChat = onChat.filter((obj) => obj.tagId === del);
    console.log('Alguém desconectou');
  });

  socket.on('nickName', (user) => {
    io.emit('nickName', user);
  });
});
  // const formatedHours = formatHours(now);
  // socket.emit('mesage', 'Seja bem vindo');

  // socket.broadcast.emit('newConnection', { message: 'Nova conexão' });
  // socket.broadcast.emit('serverMessage', { message: 'Algo' });

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
