const handleNewConnection = require('./handleNewConnection');
const sendChatMessage = require('./sendChatMessage');
const handleClientDisconnection = require('./handleClientDisconnection');
const handleNicknameChange = require('./handleNicknameChange');

module.exports = {
  handleNewConnection,
  sendChatMessage,
  handleClientDisconnection,
  handleNicknameChange,
};
