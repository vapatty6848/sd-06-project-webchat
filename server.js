const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
  res.render('home');
});

let users = [];

//  const teste = (socket) => () => {
//   users.push({ socketId: socket.id, name: `Guest_${socket.id}` });

//   io.emit('updateUsers', users);
//   io.emit('logStatus', `Usuário ${socket.id} conectou`);
// };

io.on('connection', (socket) => {
  socket.on('newUser', () => {
    users.push({ socketId: socket.id, name: `Guest_${socket.id}` });

  io.emit('updateUsers', users);
  io.emit('logStatus', `Usuário ${socket.id} conectou`);
  });
  
  socket.on('message', ({ chatMessage, nickname }) => {
   io.emit('newMessage', `${nickname} ${chatMessage}`);
  });

  socket.on('logStatus', (logStatus) => {
    io.emit('logStatus', logStatus);
  });

  socket.on('disconnect', () => {
    io.emit('logStatus', `Usuário ${socket.id} desconectou`);
    // console.log(socket.id, users);
    users = users.filter((user) => user.socketId !== socket.id);
    
    io.emit('updateUsers', users);
  });
});

httpServer.listen('3000');
