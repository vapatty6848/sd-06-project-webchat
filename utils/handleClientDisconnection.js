function handleClientDisconnection({ socket, users, io }) {
  const disconnectedClientIndex = users.findIndex((user) => (
    user.socketId === socket.id
  ));
  users.splice(disconnectedClientIndex, 1);
  console.log('List after user exit', users);
  io.emit('updateUsersList', users);
}

module.exports = handleClientDisconnection;
