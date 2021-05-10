const dateformat = require('dateformat');

module.exports = (io) => {
  const sockets = {};
  return (socket) => {
    console.log(`New user connected: ${socket.id}`);
    socket.on('userConnected', (nickname) => {
      sockets[socket.id] = nickname;
      io.emit('usersConnected', sockets);
    });
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected.`);
      delete sockets[`${socket.id}`];
    });
    socket.on('message', (message) => {
      console.log(message);
      const now = dateformat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
      io.emit('message', `${now} - ${message.nickname}: ${message.chatMessage}`);
    });
  };
};