const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.static('public'));
const port = 3000;
const httpServer = require('http').createServer(app);

// a inclusão do cors, nesse caso, foi opcional devido ao fato deles (socket e app) estarem rodando na mesma porta (3000)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});
// const messageController = require('./controllers');
const messages = require('./models/messages');
const socketHandler = require('./socket');

io.on('connection', socketHandler(io));
const nickname = require('./util/nickname');

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', async (_req, res) => {
  const allMessages = await messages.getAll();
  res.render('home', { nickname: nickname(), allMessages });
});
// app.use('/messages', messageController);

httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));