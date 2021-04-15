const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

// Roda o socket io
const io = require('socket.io')(httpServer);

const manageDate = () => {
  // const includeZero = (n) => {
  //   if (n <= 9) return `0${n}`;
  //   return n;
  // };
  const date = new Date().toLocaleDateString('en-GB');
  const hour = new Date().toLocaleTimeString('en-GB');
  const dateAndHour = (`${date} ${hour}`).replace(/[/]/g, '-');
  return dateAndHour;
};

io.on('connection', (socket) => {
  console.log(`usuario novo conectado ${socket.id}`);

  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const dateAndHour = manageDate();
    const formattedMessage = `${dateAndHour} - ${nickname}: ${chatMessage}`;
    console.log(formattedMessage);
    io.emit('message', formattedMessage);
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