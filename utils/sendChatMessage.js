const MOMENT = require('moment');

function sendChatMessage({ chatMessage, nickname, io }) {
  const timestamp = MOMENT().format('DD-MM-YYYY HH:mm:ss');
  const message = `${timestamp} - ${nickname}: ${chatMessage}`;
  console.log(message);
  io.emit('message', message);
}

module.exports = sendChatMessage;
