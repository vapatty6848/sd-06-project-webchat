const socketIo = require('socket.io');

const config = { cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] } };

const chat = (http) => {
  const io = socketIo(http, config);

  return io.on('connection', (socket) => {
    socket.on('setNickname', (nickname) => socket.emit('welcome', nickname));
    // socket.broadcast.emit('newUser', { message: 'New user on chat!' });
    socket.on('disconnect', () => console.log('Disconnected'));

    socket.on('message', (messageObj) => {
      const dateHour = new Date();
      
      let day = dateHour.getDate();
      day = day < 10 ? `0${day}` : day;
    
      let month = dateHour.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;

      const year = dateHour.getFullYear();
      const hour = dateHour.toLocaleTimeString();
      const date = `${day}-${month}-${year}`;
      const message = `${date} ${hour} ${messageObj.nickname} ${messageObj.chatMessage}`;
      io.emit('message', message);
    });

    socket.on('nicknameChange', () => console.log('Nickname'));
  });
};

module.exports = chat;
