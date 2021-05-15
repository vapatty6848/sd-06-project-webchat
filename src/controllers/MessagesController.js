const Message = require('../models/Message');
const { formatDate } = require('../utils/formatting');

class MessagesController {
  async create({ nickname, chatMessage }) {
    this.count += 1;
    
    const messageModel = new Message();
    const date = formatDate();
    return messageModel.create({ nickname, chatMessage, date });
  }

  async list() {
    this.count += 1;
    const messageModel = new Message();

    return messageModel.findAll();
  }
}

module.exports = MessagesController;