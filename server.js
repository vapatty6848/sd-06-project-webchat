const express = require('express');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const app = express();
app.use(express.static(`${__dirname}/public/`));

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const { createTimestamp } = require('./utils/TimeStamp');

app.set('view engine', 'ejs');
app.set('views', './views');

// Socket Connection
io.on('connection', (socket) => {
  console.log(`Id do usúario conectado: ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamp = createTimestamp();

    io.emit('message', `${timestamp} - ${nickname} disse: ${chatMessage}`);
  });
});

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(PORT, () => console.log(`App Webchat listening on port ${PORT}!`));
