const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
// Roda o socket io
const io = require('socket.io')(httpServer);
const modelMessages = require('./models/messagesConnection');

const PORT = 3000;

let usersConnected = [];

app.set('view engine', 'ejs');
app.set('views', './views');

const manageDate = () => {
  const date = new Date().toLocaleDateString('en-GB');
  const hour = new Date().toLocaleTimeString('en-GB');
  const dateAndHour = (`${date} ${hour}`).replace(/[/]/g, '-');
  return dateAndHour;
};
// 2
function generatorNickname(lengthNickname) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < lengthNickname; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
// 2

function handleNewUser(socket) {
  socket.on('initializeUser', () => {
    const newNickname = generatorNickname(16);
    const newUser = { socketId: socket.id, nickname: newNickname };

    usersConnected.unshift(newUser);

    io.emit('addNewUser', newUser);
  });
}

function handleMessage(socket) {
  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    const dateAndHour = manageDate();
    const formattedMessage = `${dateAndHour} - ${nickname}: ${chatMessage}`;
    await modelMessages.saveMessage({ chatMessage, nickname, dateAndHour });
    io.emit('message', formattedMessage);
  });
}

function handleNewNickname(socket) {
  socket.on('setNewNickname', (oldNickname, newNickname) => {
    usersConnected = usersConnected.map((user) => {
      const userUpdated = user;
      if (userUpdated.socketId === socket.id) {
        userUpdated.nickname = newNickname;
      }
      return userUpdated;
    });
    const updatedUser = { oldNickname, newNickname };
    io.emit('updatedUserNickname', updatedUser);
  });
}

function handleDisconnectUser(socket) {
  socket.on('disconnect', () => {
    const userDisconnected = usersConnected.find((user) => user.socketId === socket.id);
    usersConnected = usersConnected.filter((user) => user.socketId !== socket.id);
    io.emit('disconnectUser', userDisconnected);
  });
}

io.on('connection', (socket) => {
  socket.emit('usersConnected', usersConnected);
  
  handleNewUser(socket);

  handleMessage(socket);

  handleNewNickname(socket);

  handleDisconnectUser(socket);
});

// 3
app.get('/', async (_req, res) => {
  const getAllMessages = await modelMessages.messagesGetAll();
  const messagesMapFormat = getAllMessages.map((e) =>
  `${e.dateAndHour} - ${e.nickname}: ${e.chatMessage}`);
  // console.log('messagesToRender', messagesMapFormat);
  // const nicknameMapFormat = getAllMessages.map((e) => e.nickname);
  const nicknameMapFormat = [];// usersConnected.map((user) => user.nickname);
  return res.render('home', { messagesMapFormat, nicknameMapFormat });
});
// 3

httpServer.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});