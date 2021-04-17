const Message = require('../database/models/Message');
const { formatMessage } = require('./formatMessage');

async function createMessage({ chatMessage, nickname }) {
  const messageModel = new Message();
  const timestamp = new Date(Date.now()).toISOString();

  const createdMessage = await messageModel.create({ timestamp, chatMessage, nickname });

  const formattedMessage = formatMessage(createdMessage);

  return formattedMessage;
}

module.exports = {
  createMessage,
};
