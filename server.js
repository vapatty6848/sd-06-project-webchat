const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);

const users = [];
  // Source: https://attacomsian.com/blog/javascript-generate-random-string
  const randomNicknameGenerator = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let nickname = '';
    for (let i = 0; i < length; i++) {
        nickname += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return nickname;
  };

io.on('connection', (socket) => {
  console.log(`User ${socket.id} has joined the room`);

  socket.on('random-nickname', () => {
    // console.log(`socketId: ${socketId}`);
    const nickname = randomNicknameGenerator();
    const newUser = { nickname, socketId: socket.id };
    users.push(newUser)
    socket.emit('public-nickname', users);
  })

  socket.on('change-nickname', (nickname, idFromClient) => {
    const userToChangeNickname = users.find((user) => user.socketId === idFromClient)
    console.log('users: ', users);
    userToChangeNickname.nickname = nickname;
    
    // users.forEach((user) => {
    //   if (user.nickname === userToChangeNickname.nickname) {
    //     user.nickname = userToChangeNickname.nickname
    //   }
    // })
    // console.log('users: ', users);
    
    
    // console.log('userToChangeNickname: ', userToChangeNickname);
    // console.log('idFromClient: ', idFromClient);
    const shouldClearNicknameList = true;

    socket.emit('public-nickname', users, shouldClearNicknameList);
  })

  socket.on('disconnect', () => {
    io.emit('newMessage', `User ${socket.id} has left the room`);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen('3000', () => console.log('Running on port 3000'));