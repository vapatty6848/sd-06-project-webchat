const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);
const { sendMessage } = require('./socketHandler/socketHandler');
const { getMessages } = require('./models/messagesModel');

const publicPath = path.join(__dirname, '/public');

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('message', (messagePayload) => sendMessage(messagePayload, io));
});

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(cors());

app.use('/', express.static(publicPath));

app.get('/', async (req, res) => {
  console.log(getMessages);
  const messageHistory = await getMessages();
  console.log(messageHistory);
  res.status(200).render('index', { messageHistory });
});

http.listen(3000, () => {
  console.log('Server on port 3000');
});