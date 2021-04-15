const express = require('express');
const ejs = require('ejs');

const app = express();
const http = require('http').createServer(app);

const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(socket);
  console.log('connected');
});

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

http.listen(3000, () => {
  console.log('Server on port 3000');
});