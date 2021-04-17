const { formatDate } = require('./formatDate');

function formatMessage({ timestamp, chatMessage, nickname }) {
  const date = new Date(timestamp);
  const formattedDate = formatDate(date);

  const info = `${formattedDate} - ${nickname}:`;
  const msg = `${info} ${chatMessage}`;

  return msg;
}

module.exports = {
  formatMessage,
};
