const express = require('express');
// const messageController = require('./controllers');

const app = express();
app.use(express.static('public'));
const port = 3000;
const httpServer = require('http').createServer(app);

// a inclusão do cors, nesse caso, foi opcional devido ao fato deles (socket e app) estarem rodando na mesma porta (3000)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const socketHandler = require('./socket');

io.on('connection', socketHandler(io));
const nickname = require('./util/nickname');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', (_req, res) => res.render('home', { nickname: nickname() }));
// app.use('/messages', messageController);

httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));