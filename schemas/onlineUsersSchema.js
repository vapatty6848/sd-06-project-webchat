const { Schema } = require('mongoose');

const onlineUsers = new Schema({
  nickname: String,
  socketId: String,
}, { collection: 'online_users' });

module.exports = onlineUsers;
