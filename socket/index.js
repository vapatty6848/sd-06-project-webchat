const dateformat = require('dateformat');
const messages = require('../models/messages');

module.exports = (io) => {
  const sockets = {};
  return (socket) => {
    console.log(`New user connected: ${socket.id}`);
    socket.on('userConnected', (nickname) => {
      sockets[socket.id] = nickname;
      io.sockets.emit('usersConnected', sockets);
    });
    socket.on('disconnect', () => {
      delete sockets[`${socket.id}`];
      io.sockets.emit('usersConnected', sockets);
    });
    socket.on('message', async (message) => {
      const { chatMessage, nickname } = message;
      await messages.insertMessage(chatMessage, nickname);
      const now = dateformat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
      io.emit('message', `${now} - ${message.nickname}: ${message.chatMessage}`);
    });
  };
};