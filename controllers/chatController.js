const MessagesService = require('../services/messages.js');

const createMessages = async (timestamp, nickname, message) => {
  return await MessagesService.createMessage(timestamp, nickname, message);
}

const getMessages = async () => {
  const messages = await MessagesService.getMessages();
  return messages;
};

module.exports = {
  createMessages,
  getMessages,
};