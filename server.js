// Faça seu código aqui
// codigo consultado no course

const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '../views/chat.ejs');
});

io.on('connection', (socket) => {
  console.log(
    'Usuário conectado'
  );
  socket.on('disconnect', () => {
    console.log(
      'bye bye'
    );
  });
  socket.emit('ola', ':)' );
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
