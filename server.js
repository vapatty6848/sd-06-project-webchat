const express = require('express');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);

const port = 3000;
app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(httpServer, {
  // configuracoes do cors
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});
// const modelMessages = require('./models/messagesConnection');

app.use(cors());

let clients = [];

// const addNewUser = (socket, nickname) => {
//   const newUser = {
//     id: socket.id,
//     nickname,
//   };
//   clients.push(newUser);
// };

// const addNickname = (nickname, socket) => {
//   const index = clients.findIndex((user) => user.id === socket.id);
//   clients[index].nickname = nickname;
// };

// const changeNickname = (newNickname, socket) => {
//   const index = clients.findIndex((user) => user.id === socket.id);
//   clients[index].nickname = newNickname;
// };

// const getNickname = (socket) => {
//   const index = clients.findIndex((user) => user.id === socket.id);
//   return clients[index].nickname;
// };

// const getRandomChars = () => {
//   const length = 16;
//   const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i += 1) {
//     result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
//   }
//   return result;
// };

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${
    time.getMonth() + 1
  }-${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

const formatedMessage = ({ chatMessage, nickname }) => {
  const result = `${getTime()} ${nickname} ${chatMessage}`;
  io.emit('message', result);
};

// escuta nova conexão
io.on('connection', (socket) => {
  console.log(`Novo usuário conectado: ${socket.id}`);

  socket.on('connectedClient', (nickname) => {
    clients.push({ id: socket.id, nickname });
    io.emit('nickname', clients);
  });
  
  // escuta messagens
  socket.on('message', (msg) => formatedMessage(msg));

  socket.on('changeNickname', (newNickname) => {
    const chat = clients.find((user) => user.id === socket.id);
    chat.nickname = newNickname;
    clients = clients.map((user) => (user.id === socket.id ? chat : user));
    io.emit('nickname', clients);
  });

  socket.on('disconnect', () => {
    console.log(`Usuário ${socket.id} desconectado`);
  });
});

app.get('/', (req, res) => res.render('index'));

httpServer.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`);
});
