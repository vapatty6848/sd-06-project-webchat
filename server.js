const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  },
});
const { chatController } = require('./controllers/chatController');
const { getAllMessages } = require('./models/chatModel');
const { msgFormat } = require('./utils');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public/`));

app.get('/', async (_req, res) => {
  const previousMessages = await getAllMessages();
  const messagesToRender = previousMessages.map((message) => msgFormat(message));
  return res.render('index', { messagesToRender });
  // res.sendFile(`${__dirname}/views/index.html`);
});

const ioConnection = (socket) => chatController(io, socket);

io.on('connection', ioConnection);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});