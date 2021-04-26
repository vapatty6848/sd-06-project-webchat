const getPrefix = require('../utils/getMessagePrefix');
const { saveMessage } = require('../models/messagesModel');

const sendMessage = async ({ nickname, chatMessage }, io) => {
  const { messagePrefix, convertedDate } = getPrefix(nickname);
  await saveMessage(chatMessage, nickname, convertedDate);
  const completeMessage = `${messagePrefix}${chatMessage}`;
  io.emit('message', completeMessage);
};

module.exports = { sendMessage };