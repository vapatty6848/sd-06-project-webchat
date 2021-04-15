const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const { createTimestamp } = require('./utils/createTimestamp');

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectado!`);

  socket.on('message', ({ nickname, chatMessage }) => {
    const timestamp = createTimestamp();

    io.emit('message', `${timestamp} - ${nickname} disse: ${chatMessage}`);
  });
});

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(port, () => console.log(`Webchat server on port ${port}!`));