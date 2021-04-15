const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;
const io = require('socket.io')(httpServer);

const generateData = () => {
  const data = new Date().toLocaleDateString('en-GB');
  const time = new Date().toLocaleTimeString('en-GB');
  const dateTime = (`0${data} ${time}`).replace(/[/]/g, '-');
  return dateTime;
};

io.on('connection', (socket) => {
 // socket.on('NewUser', (user) => console.log(user));
console.log(socket.id);

  socket.on('message', (message) => {
  console.log(message);
  const { chatMessage, nickname } = message;
  const dateTime = generateData();
  const messageFormat = `${dateTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageFormat);
  });
});

app.set('view engine', 'ejs');
// app.set('views', './views');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(PORT, () => console.log(`Escutando a porta ${PORT}`));
