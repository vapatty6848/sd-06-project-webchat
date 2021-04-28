// Faça seu código aqui
// Projeto feito com ajuda do André Sartoreto e Luiz Simões
const express = require('express');
const cors = require('cors');
const path = require('path');
const dateFormat = require('dateformat');// Dica do Luiz Simões

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const { newMessage, getAllMessages } = require('./models/chat');

app.use(cors());

app.get('/', async (request, response) => {
  const pathToRender = path.join(__dirname, '/views/index.ejs');
  const msgs = await getAllMessages();
  const renderMsgs = msgs.map((message) => 
    `${message.timestamp} ${message.nickname} ${message.chatMessage}`);
  return response.render(pathToRender, { renderMsgs });
});

let allUsers = [];

const newUser = ({ nickname, socket }) => {
  allUsers.push({ id: socket.id, nickname });
  console.log(allUsers);
  io.emit('onlineUsers', allUsers);
};

const changeNickname = ({ newNickname, socket }) => {
  allUsers.map((user) => {
    if (user.id === socket.id) Object.assign(user, { id: user.id, nickname: newNickname });
    return user;
  });
  io.emit('onlineUsers', allUsers);
};

const handleChatMessage = async ({ nickname, chatMessage }) => {
  const timestamp = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss');
  const result = `${timestamp} ${nickname} ${chatMessage}`;
  await newMessage({ nickname, chatMessage, timestamp });
  io.emit('message', result);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => newUser({ nickname, socket }));

  socket.on('changeNickname', (newNickname) => changeNickname({ newNickname, socket }));

  socket.on('message', async ({ nickname, chatMessage }) =>
    handleChatMessage({ nickname, chatMessage }));

  socket.on('disconnect', () => {
    const onlineUsers = allUsers.filter((user) => user.id !== socket.id);
    allUsers = onlineUsers;
    io.emit('onlineUsers', allUsers);
  });
});

http.listen(3000, () => {
  console.log('Listening on 3000');
});