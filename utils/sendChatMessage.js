const MOMENT = require('moment');
const Messages = require('../models/Messages');

async function sendChatMessage({ chatMessage, nickname, io }) {
  const timestamp = MOMENT().format('DD-MM-YYYY HH:mm:ss');
  const message = `${timestamp} - ${nickname}: ${chatMessage}`;
  console.log(message);
  await Messages.create(chatMessage, nickname, timestamp);
  io.emit('message', message);
}

module.exports = sendChatMessage;
