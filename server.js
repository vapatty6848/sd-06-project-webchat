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

const messageFunction = (info) => {
  const { nickName, chatMessage } = info;
  console.log('*******************', info);
  const now = new Date();
  const tmp = `${addLeftZero(now.getDate())}-${addLeftZero(now.getMonth())}-${now.getFullYear()}`;
  const msg = `${tmp} ${formatHours(now)} - ${nickName}: ${chatMessage}`;
  return msg;
};

const disconectFunction = (id) => {
  onChat = onChat.filter((objOnChat) => objOnChat.id !== id);
  return onChat;
};

const connectFunction = (id) => {
  const obj = { id, nickName: id.toString().substr(0, 16) };
  onChat.push(obj);
  console.log(onChat);
  return onChat;
};

const alterNickNameFunction = (newUser) => {
  const { id, nickname } = newUser;
  for (let index = 0; index < onChat.length; index += 1) {
    if (onChat[index].id === id) {
      onChat[index].nickName = nickname;
    }
  }
  return onChat;
};

app.use(cors());

io.on('connection', (socket) => {
  io.emit('conexao', connectFunction(socket.id));

  socket.on('alterNickName', (newUser) => {
    io.emit('alterNickName', alterNickNameFunction(newUser));
  });
    
  socket.on('message', (info) => {
    console.log(info, onChat);
    io.emit('message', messageFunction(info));
  });
  
  socket.on('disconnect', () => {
    io.emit('alterUsers', disconectFunction(socket.id));
  });
});

  // socket.broadcast.emit('newConnection', { message: 'Nova conexão' });
  // socket.broadcast.emit('serverMessage', { message: 'Algo' });

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
