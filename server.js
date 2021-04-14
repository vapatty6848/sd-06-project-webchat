const express = require('express');

const app = express();

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

io.on('connection', (socket) => console.log(`Usuário ${socket.id} conectou!`));

app.set('view engine', 'ejs');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(3000, () => console.log('Servidor ouvindo na porta 3000'));
