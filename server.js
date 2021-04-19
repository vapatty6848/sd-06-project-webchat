require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
// app.use(express.static(`${__dirname}/public/`));

io.on('connection', async (socket) => {
  console.log('conectado');
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
});

app.get('/', (req, res) => res.render(`${__dirname}/views/chat.ejs`));
http.listen(PORT, () => console.log(`webchat port: ${PORT}!`));