const changeUser = (socket, users) => {
  const index = users.findIndex((u) => u.socketId === socket.id);
  if (index !== -1) users.splice(index, 1);
};

const sendMsg = (obj, date) => `${date} ${obj.nickname} ${obj.chatMessage}`;

module.exports = {
  changeUser,
  sendMsg,
};