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
const model = require('./models');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

io.on('connection', (socket) => {
  console.log(
    'Usuário conectado'
  );
  socket.emit('ola', ':)' );
  socket.broadcast.emit('mensagemServer', { mensagem: 'new user is online'});
  socket.on('disconnect', () => {
    console.log(
      'bye bye'
    );
  });
  socket.on('mensagem', (msg) => {
    io.emit('mensagemServer', { mensagem: msg });
  });
});

app.get('/', (_req, res) => {
  const msgs = model.get();
  res.render('chat', { msgs });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
