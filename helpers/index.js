function formatDate(date, fotmat = '') {
  if (fotmat === 'back-end') {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
}

function formatTime(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}

function formatMessage(dateANDtime, msg) {
  return `${dateANDtime} - ${msg.nickname}: ${msg.chatMessage}`;
}

module.exports = {
  formatDate,
  formatTime,
  formatMessage,
};
