const sendMessage = (obj, date) => `${date} ${obj.nickname} ${obj.chatMessage}`;

module.exports = {
  sendMessage,
};