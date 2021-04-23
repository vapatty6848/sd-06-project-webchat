const express = require('express');
const cors = require('cors');

const app = express();

const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

const io = require('socket.io')(http, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

app.use(cors());

const twoDigitsNumber = (number) => {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
};

const getDate = () => {
  const date = new Date();
  const day = twoDigitsNumber(date.getDate());
  const month = twoDigitsNumber(date.getMonth());
  const year = date.getFullYear();
  const hour = twoDigitsNumber(date.getHours());
  const minute = twoDigitsNumber(date.getMinutes());

  const newFormatDate = `${day}-${month}-${year} ${hour}:${minute}`;
  return newFormatDate;
};

io.on('connection', (socket) => {
  console.log(`usuário conectado ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = getDate();
    const theNewMessage = `${date} ${nickname} ${chatMessage}`;
    io.emit('message', theNewMessage);
  });

  // socket.on('disconnect', () => {
  //   console.log('usuário desconectado');
  // });
});

app.get('/', (req, res) => {
  res.render('chat/index');
});

http.listen(3000, () => console.log('Servidor na porta 3000'));
