const sendMessage = (obj, date) => `${date} ${obj.nickname} ${obj.chatMessage}`;

const removeUser = (socket, users) => {
  const index = users.findIndex((u) => u.socketId === socket.id);
  if (index !== -1) users.splice(index, 1);
};

module.exports = {
  sendMessage,
  removeUser,
};
