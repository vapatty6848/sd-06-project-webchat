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

  // https://www.ti-enxame.com/pt/javascript/gere-stringcaracteres-aleatorios-em-javascript/967048592/
  // const randonNickname = () => {
  //   let newNickname = '';
  //   const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  //   for (let i = 0; i < 16; i = +1) {
  //     newNickname += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  //   }
  //  return newNickname;
  // };

io.on('connection', (socket) => {
  console.log(`usuário conectado ${socket.id}`);

  // const nickname = randonNickname();
  // const date = new Date();
  socket.on('Message', (message) => {
    console.log(message);
    io.emit('newMessage', message);
  });

  // socket.on('disconnect', () => {
  //   console.log('usuário desconectado');
  // });
});

app.get('/', (req, res) => {
  res.render('chat/index');
});

http.listen(3000, () => console.log('Servidor na porta 3000'));
