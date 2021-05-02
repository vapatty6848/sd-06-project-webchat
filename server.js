const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http');

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

let allUsers = [];

const addNewUser = ({ socket, nickname }) => {
  allUsers.push({ id: socket.id, nickname });
  io.emit('updatOnlineUsers', allUsers);
};

io.on('connection', async (socket) => {
  socket.on('newUser', ({ nickname }) => addNewUser({ socket, nickname }));
});

http.listen(3000, () => {
  console.log(`Servindo na porta ${PORT}`);
});
