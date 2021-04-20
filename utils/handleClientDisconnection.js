const usersList = require('../server.js');

function handleClientDisconnection({ socket, io }) {
  const clientIndex = usersList.users.findIndex((user) => (
    user.socketId === socket.id
  ));
  usersList.users.splice(clientIndex, 1);
  console.log('Remaining users', usersList.users);
  io.emit('usersUpdate', usersList.users);
}

module.exports = handleClientDisconnection;
