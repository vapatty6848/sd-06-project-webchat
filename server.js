const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;
const io = require('socket.io')(httpServer);

io.on('connection', (socket) => {
console.log(`Usuário novo conectado ${socket.id}`);
});
app.set('view engine', 'ejs');
// app.set('views', './views');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(PORT, () => console.log(`Escutando a porta ${PORT}`));