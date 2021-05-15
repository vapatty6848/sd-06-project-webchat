const moment = require('moment');

function formatDate() {
  return moment().format('DD-MM-yyyy HH:mm:ss');
}

function formatMessage({ date, chatMessage, nickname }) {
  return `${date} ${nickname} ${chatMessage}`;
}
module.exports = { formatDate, formatMessage };
