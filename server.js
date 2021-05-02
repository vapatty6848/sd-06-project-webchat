const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');

app.get('/', async (req, res) => await res.sendFile(__dirname + '/public/index.html'));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('Connected');
  socket.emit('welcome', 'Welcome!');

  socket.broadcast.emit('newUser', { message: 'New user on chat!' });
  socket.on('disconnect', () => console.log('Disconnected'));

  socket.on('message', (messageObj) => {
    console.log(messageObj)
    const dateHour = new Date();
  
    let day = dateHour.getDate();
    day = day < 10 ? `0${day}` : day;
  
    let month = dateHour.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    const year = dateHour.getFullYear();

    const hour = dateHour.toLocaleTimeString();
    const date = day + '-' + month + '-' + year;
    const message = `${date} ${hour} ${messageObj.nickname} ${messageObj.chatMessage}`;
    console.log(message)

    io.emit('messageServer', message);
  });
});

http.listen(3000, () => console.log('Running on port 3000'))