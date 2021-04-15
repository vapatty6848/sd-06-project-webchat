const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log(new Date());

  socket.on('message', ({ chatMessage, nickname }) => {
    const time = new Date();
    const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
      .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    const response = `${timeFormated} ${nickname} ${chatMessage}`;

    io.emit('message', response);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

http.listen(3000, () => console.log('Ouvindo na porta 3000'));