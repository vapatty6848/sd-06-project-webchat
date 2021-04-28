const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('Alguém se conectou');

  socket.on('disconnect', () => {
    console.log('Alguém desconectou');
  });

  socket.on('mensagem', (msg) => {
    io.emit('serverMessage', { message: msg });
  });

  socket.on('nickName', (msg) => {
    console.log(`${msg} entrou`);
  });

  socket.emit('mesages', 'Seja bem vindo');

  socket.broadcast.emit('newConnection', { message: 'Nova conexão' });
  socket.broadcast.emit('serverMessage', { message: 'Algo' });
});

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
