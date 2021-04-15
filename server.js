const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const randomize = require('randomatic');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.use(cors);

io.on('connection', (socket) => {
  socket.on('message', (message) => console.log('fist message: ', message));
});

app.set('views engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('chathome');
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}.`));
