const express = require('express');
const cors = require('cors');
const dateFormat = require('dateformat');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

io.on('connection', (socket) => {
  console.log(`usuário conectado ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const dateAndTime = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
    const theNewMessage = `${dateAndTime} ${nickname} ${chatMessage}`;
    io.emit('message', theNewMessage);
  });
});

app.get('/', (_req, res) => {
  res.render('home');
});

http.listen(3000, () => console.log('Servidor na porta 3000'));