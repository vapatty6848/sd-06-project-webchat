// Faça seu código aqui
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.use(express.json());

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectado`);
});

app.set('view engine', 'ejs');
app.get('/', (_req, res) => {
  res.render('index');
});

httpServer.listen(3000);