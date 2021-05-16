const express = require('express');

const app = express();
const server = require('http').createServer(app);

const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

const Model = require('./models/Messages');
const messageController = require('./controllers/messagesController');

const PORT = 3000;

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/', messageController);

  const sendMessage = async (chatMessage, nickname) => {
    const date = new Date().toLocaleString().replace(/\//g, '-');
    const message = `${date} ${chatMessage}: ${nickname}`;
    await Model.saveMessage(chatMessage, nickname, date);
    io.emit('message', message);
  };

  let usersIntheChatRoom = [];

  const handleNewUser = (socket, newUser) => {
    usersIntheChatRoom.push({ id: socket.id, nickname: newUser });
    io.emit('setOnlineUsers', usersIntheChatRoom);
  };

  const handleDisconnect = (socket) => {
    const userOff = usersIntheChatRoom.find((user) => user.id === socket.id);
    if (userOff) {
      usersIntheChatRoom = usersIntheChatRoom.filter((user) => user !== userOff);
      console.log(usersIntheChatRoom);
      io.emit('userDisconnected', usersIntheChatRoom);
    }
  };

  const updateNickname = (socket, nickname) => {
    const userToUpdate = usersIntheChatRoom.find((user) => user.id === socket.id);
    usersIntheChatRoom = usersIntheChatRoom.filter((user) => user !== userToUpdate);
    socket.emit('updateUserNick', [{ id: socket.id, nickname }, ...usersIntheChatRoom]);
    usersIntheChatRoom.push({ id: socket.id, nickname });
    console.log(usersIntheChatRoom);
    socket.broadcast.emit('updateUserNickToOthers', usersIntheChatRoom);
  };

  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => sendMessage(chatMessage, nickname));
    socket.on('disconnect', () => handleDisconnect(socket));
    socket.on('newUser', (newUser) => handleNewUser(socket, newUser));
    socket.on('updateNickname', (nickname) => updateNickname(socket, nickname));
  });

server.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});