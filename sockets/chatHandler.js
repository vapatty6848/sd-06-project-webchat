const { chat } = require('../controllers');

const utils = require('../utils');

module.exports = (io, socket) => {
  const chatMessage = async (msg) => {
    const { messageFrontend, messageBackend } = utils.setupMessages(msg);
    await chat.create(messageBackend);
    io.emit('message', messageFrontend);
  };

  socket.on('message', chatMessage);
};
