const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = 3000;
const io = require('socket.io')(httpServer);

const generateData = () => {
  const data = new Date().toLocaleDateString('en-GB');
  const time = new Date().toLocaleTimeString('en-GB');
  const dateTime = (`0${data} ${time}`).replace(/[/]/g, '-');
  return dateTime;
};

const users = [];
io.on('connection', (socket) => {
console.log(`${socket.id}, Conectou`);

  socket.on('NewUser', (user) => {
    console.log(''+ '' + user)
    users.push({ id: `${socket.id}`, name: user });
    io.emit('usersNick', users);
});
  socket.on('message', (message) => {   
    const { chatMessage, nickname } = message;
    const dateTime = generateData();
    const messageFormat = `${dateTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageFormat);
  });

  socket.on('disconnect', () => {
    const userIndex = users.findIndex((user) => user.id === socket.id);
    if (userIndex !== -1) users.splice(userIndex, 1);  
    io.emit('usersNick', users);
    console.log(`${socket.id}, Desconectou`);
  });
});

app.set('view engine', 'ejs');
// app.set('views', './views');

app.get('/', (_req, res) => res.render('home'));

httpServer.listen(PORT, () => console.log(`Escutando a porta ${PORT}`));
