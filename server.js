const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
// Roda o socket io
const io = require('socket.io')(httpServer);

io.on('connection', (socket) => {
  console.log(`usuario novo conectado ${socket.id}`);

  socket.on('message', (message) => {
    console.log(message);
    io.emit('newMessage', message);
  });
});

let quantity = 0;

app.get('/', (_req, res) => {
  res.render('home', { quantity });
  quantity += 1;
});

httpServer.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});