const app = require('express')();
const httpServer = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');

const port = 3000;

app.use(cors());

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectado`);

  socket.on('message', (data) => {
    // console.log('mensagem usuario', data);
    io.emit('message', data);
  });
});

app.get('/', (_req, res) => {
  res.render('home/index');
});

httpServer.listen(port, () => console.log(`Example app listening on ${port}!`));
