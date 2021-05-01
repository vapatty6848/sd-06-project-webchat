const MessagesService = require('../services/messages.js');

const createMessages = async (timestamp, nickname, message) => {
  await MessagesService.createMessage(timestamp, nickname, message);
  return true;
};

const getMessages = async () => {
  const messages = await MessagesService.getMessages();
  return messages;
};

module.exports = {
  createMessages,
  getMessages,
};