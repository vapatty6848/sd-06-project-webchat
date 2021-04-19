function handleClientDisconnection({ socket, users, io }) {
  const clientIndex = users.findIndex((user) => (
    user.socketId === socket.id
  ));
  const disconnectedClient = users[clientIndex];
  console.log(`${disconnectedClient.nickname}(Id: ${disconnectedClient.socketId}) disconnected`);
  users.splice(clientIndex, 1);
  console.log('Remaining users', users);
  io.emit('updateUsersList', users);
}

module.exports = handleClientDisconnection;
