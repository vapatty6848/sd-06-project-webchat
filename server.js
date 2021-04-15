// Faça seu código aqui
const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.BASE_URL || 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const PORT = 3000;

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('Conectado');

  socket.on('user', (user) => {
  socket.broadcast.emit('user', user);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const time = new Date();
    const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
     .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    const response = `${timeFormated} ${nickname} ${chatMessage}`;
    // ________________
    // NÃO ENTENDI:
    // socket.broadcast.emit('message', response);
    io.emit('message', response);
    // ________________
  });
    
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
});

http.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});