const { Schema } = require('mongoose');

const messages = new Schema({
  message: String,
  nickname: String,
  timestamp: { type: Date, default: Date.now },
}, { collection: 'messages' });

module.exports = messages;