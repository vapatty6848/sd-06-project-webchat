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
const { saveMessage, messagesGetAll } = require('./models/messagesConnection');

app.use(cors());

let clients = [];

const getTime = () => {
  const time = new Date();
  const timeFormated = `${time.getDate()}-${
    time.getMonth() + 1
  }-${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return timeFormated;
};

const formatedMessage = async ({ chatMessage, nickname }) => {
  const result = `${getTime()} ${nickname} ${chatMessage}`;
  await saveMessage(getTime(), nickname, chatMessage);
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
    const exit = clients.find((user) => user.id === socket.id);
    const index = clients.indexOf(exit);
    clients = clients.splice(index, 1); 
  });
});

app.get('/', async (_req, res) => {
  const allMessages = await messagesGetAll();
  console.log('allmessages:', allMessages);
  const messages = allMessages.map(
    (msg) => `${msg.timestamp} ${msg.nickname} ${msg.message}`,
  );
  res.render('index', { messages }); 
});

httpServer.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`);
});
