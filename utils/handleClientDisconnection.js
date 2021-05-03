const usersList = require('../models/UsersList');

function handleClientDisconnection({ socket, io }) {
  const clientIndex = usersList.findIndex((user) => (
    user.socketId === socket.id
  ));
  usersList.splice(clientIndex, 1);
  console.log('Remaining users', usersList);
  io.emit('usersUpdate', usersList);
}

module.exports = handleClientDisconnection;
