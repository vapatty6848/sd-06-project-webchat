const { chatModel } = require('../models');

const renderMessages = async (_req, res) => {
  const messages = await chatModel.renderMessages();

  res
    .status(200)
    .render('chat', { messages });
};

const createMessages = async (message, nickname, timestamp) => chatModel
  .createMessages(message, nickname, timestamp);

module.exports = {
  renderMessages,
  createMessages,
};
