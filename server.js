const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

app.use(cors()); 

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`); 
});

io.on('connection', (socket) => {
  socket.broadcast.emit('userConnected', `Usuário ${socket.id} entrou`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const msgTime = new Date().toLocaleString().replace(/\//gi, '-');
    const newMessage = `${msgTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('userDisconnected', `Usuário ${socket.id} saiu`);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
