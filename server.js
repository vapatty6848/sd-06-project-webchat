const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(httpServer);

app.set('view engine', 'ejs');
app.set('views', './view');

app.get('/', (_req, res) => {
  res.render('home');
});

io.on('connection', (socket) => {
  console.log(`Novo usuário conectado: ${socket.id}`);
  
    socket.on('toBackMsg', (message) => {
      socket.broadcast.emit('toFrontMsg', message);
  });

  socket.on('nickname', (nickname) => {
    io.emit('toFrontNick', nickname);
  });
});
httpServer.listen(PORT, () => console.log(`on PORT ${PORT}`));
