const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');

io.on('connection', (socket) => {
  console.log('usuário conectado')
})

app.get('/', (req, res) => {
  res.render(path.join(__dirname, '/views/index'));
});

http.listen(3000, () => console.log('Ouvindo na porta 3000'));