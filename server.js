const app = require('express')();
const httpServer = require('http').createServer(app);
const cors = require('cors');
const dateFormat = require('dateformat');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');

const port = 3000;

app.use(cors());

const users = [];
const date = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss');

io.on('connection', (socket) => {
  console.log(`Usuário ${socket.id} conectado`);

  socket.on('message', (data) => {
    console.log('mensagem usuario', data);
    io.emit('message', `${date} ${data.nickname} ${data.chatMessage}`);
  });

/*   socket.on('updateNickname', (nickname) => {
    users = {
      userId: socket.id,
      userNickname: nickname,
    };
    console.log(users);
  });
 */
  socket.on('user', (user) => {
    console.log(user);
    users.push(user);
    console.log('array users', users);
    io.emit('user', users);
  });
});

app.get('/', (_req, res) => {
  res.render('home/index');
});

httpServer.listen(port, () => console.log(`Example app listening on ${port}!`));
