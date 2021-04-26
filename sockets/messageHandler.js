const dayjs = require('dayjs');
const formatMessage = require('../utils/formatMessage');
const { saveMessage } = require('../controllers/MessagesController');

module.exports = (io, socket) => {
  const handleMessage = (data) => {
    const date = dayjs().format('DD-MM-YYYY hh:mm:ss A');

    const formattedMessage = formatMessage(date, data.nickname, data.chatMessage);

    const savingMsg = {
      ...data,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      date,
      liMsg: formattedMessage,
    };

    // Saves message on the
    saveMessage(savingMsg);
    io.emit('message', formattedMessage);
  };

  socket.on('message', handleMessage);
};
