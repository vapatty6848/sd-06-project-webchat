const { model } = require('mongoose');
const messageSchema = require('../schemas/messageSchema');

const Message = model('Message', messageSchema);

module.exports = Message;