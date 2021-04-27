const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);
const { 
  sendMessage,
  saveUser,
  updateNickname,
} = require('./socketHandler/socketHandler');
const { getMessages } = require('./models/messagesModel');

const publicPath = path.join(__dirname, '/public');

let users = [];

const removeUser = (socket) => {
  users = users.filter((user) => user.id !== socket.id);
  return null;
};

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('login', ({ nickname }) => saveUser({ nickname, socket, users }));
  socket.on('updateNickname', ({ nickname }) => updateNickname({ nickname, socket, users }));
  socket.on('message', (messagePayload) => sendMessage(messagePayload, io));
  socket.on('disconnect', () => removeUser(socket));
});

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(cors());

app.use('/', express.static(publicPath));

app.get('/', async (req, res) => {
  const messageHistory = await getMessages();
  res.status(200).render('index', { messageHistory, users });
});

http.listen(3000, () => {
  console.log('Server on port 3000');
});
