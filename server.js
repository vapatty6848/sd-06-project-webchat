const express = require('express');
// const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);

const port = 3000;
app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});
// app.use(cors());

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectado`);

  socket.on('message', ({ nickname, chatMessage }) => {
    // console.log(nickname, chatMessage);
    const time = new Date();
    const timeFormated = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
      .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    const result = `${timeFormated} ${nickname} ${chatMessage}`;
    io.emit('message', result);
  });
});

app.get('/', (req, res) => res.render('index'));

httpServer.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`);
});
