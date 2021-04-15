// Faça seu código aqui
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log(`Conectado ${socket.id}`);
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('view');
});

httpServer.listen('3000');
