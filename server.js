const express = require('express');

const app = express();

const http = require('http');

const socketIoServer = http.createServer(app);

const socketIo = require('socket.io');

const faker = require('faker');

const randomName = faker.name.findName();

const date = new Date();

const chatMessage = 'Olá meus caros amigos';

const message = {
  date,
  randomName,
  chatMessage,
 };

console.log(message.date, message.randomName, message.chatMessage);

const io = socketIo(socketIoServer, {
  cors: {
    origin: 'http://localhost:5500',
  },
});

io.on('connection', (socket) => {
  console.log(`user: ${socket.id} conectou`);
  io.emit('teste', { message });
  socket.on('teste resposta', (msg) => {
    console.log(msg);
  });

  socket.on('disconnect', () => {
    console.log(`user: ${socket.id} saiu`);
  });
});

socketIoServer.listen(3000, () => console.log('listening on port 3000'));