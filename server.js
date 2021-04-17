const express = require('express');
// const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

// Roda o socket io
const io = require('socket.io')(httpServer);

// app.use(cors());

let quantity = 0;

app.get('/', (_req, res) => {
  res.render('home', { quantity });
  quantity += 1;
});

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
// 2
function generatorNickname(lengthNickname) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < lengthNickname; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
// 2

io.on('connection', (socket) => {
  const newUser = generatorNickname(16);
  console.log(`usuario novo conectado ${newUser}`);

  socket.emit('newUser', newUser);

  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const dateAndHour = manageDate();
    const formattedMessage = `${dateAndHour} - ${nickname}: ${chatMessage}`;
    console.log(formattedMessage);
    io.emit('message', formattedMessage);
  });
});

httpServer.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});