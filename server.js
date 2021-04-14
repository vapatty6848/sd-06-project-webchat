const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;

// Roda o socket io
const io = require('socket.io')(httpServer);

io.on('connection', (socket) => {
  console.log(`usuario novo conectado ${socket.id}`);

  socket.on('Fala Comigo Bebê', (message) => {
    console.log(message);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen(`Servidor rodando na porta ${PORT}`);