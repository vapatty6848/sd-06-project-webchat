// Faça seu código aqui
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const dateFormater = require('./utils/dateFormat');

const users = [];

io.on('connection', (socket) => {
  const guest = { id: socket.id, name: (`${socket.id}`).slice(0, 16) };
  users.push(guest);
  socket.emit('updatedUserList', users);
  socket.broadcast.emit('updatedUserList', users);
  socket.on('updateUser', ({ name, id }) => {
    const index = users.indexOf(users.find((user) => user.id === id));
    users[index].name = name;
    socket.emit('updatedUserList', users);
    socket.broadcast.emit('updatedUserList', users);
  });
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = new Date();
    const brDate = dateFormater(date);
    const person = users.find((user) => user.id === nickname);
    const message = `${brDate} - ${person.name}: ${chatMessage} `;
    io.emit('newMessage', message);
  });
});

app.use(cors);
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen(3000, () => {
  console.log('Chat Inicializado');
});
