const moment = require('moment');

function formatMessage(message, nickname) {
  const timeStamp = moment().format('DD-MM-yyyy h:mm:ss A');
  return {
    timeStamp,
    message: `${timeStamp}-${nickname}: ${message}`,
  };
}

module.exports = formatMessage;