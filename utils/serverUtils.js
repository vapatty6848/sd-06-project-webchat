const sendMessage = (obj, date) => ({
  chatMessage: `${date} - ${obj.nickname}: ${obj.chatMessage}`,
  nickname: obj.nickname,
});

module.exports = {
  sendMessage,
};