const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const dateFormat = require('dateformat');

app.use(cors());

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '/views/index.html');
  res.sendFile(htmlPath);
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} conectado`);

  socket.on('userConnect', (nickname) => {
    socket.emit('welcome', `Bem vindo ${nickname}`);
  });

  socket.broadcast
    .emit('messageServer', { message: `User ${socket.id} acabou de se conectar` });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} desconectado`);
  });

  socket.on('message', (msg) => {
    const dateTimeStamp = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss'); 

   socket.emit('messageServer', { message: `${dateTimeStamp} ${msg.nickname} ${msg.chatMessage}` });
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});
