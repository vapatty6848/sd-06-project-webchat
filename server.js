const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);

const port = 3001;

io.on('connection', (socket) => {
  socket.on('allMessage', (message) => {
    io.emit('newMessage', message);
  });
});
/**
 * io.emit manda pra todos
 * socket.emit manda para um específico
 * broadcast.emit manda para todos menos para que enviou
 */

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen(port, () => console.log(`escutando a porta ${port}!`));
