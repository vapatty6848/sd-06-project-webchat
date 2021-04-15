// Faça seu código aqui
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

 io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = new Date();
    const d = date.getDay();
    const mo = date.getMonth();
    const y = date.getFullYear();
    const h = date.getHours();
    const mi = date.getMinutes();
    const s = date.getSeconds();

    const message = `${d}-${mo}-${y} ${h}:${mi}:${s} - ${nickname}: ${chatMessage} `;

    io.emit('message', message);
  });
 });

 httpServer.listen(3000);
