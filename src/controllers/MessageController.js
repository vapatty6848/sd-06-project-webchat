const Message = require('../database/models/Message');

const { formatMessage } = require('../utils/formatMessage');

class MessageController {
  constructor() {
    this.render = this.render.bind(this);
  }

  async render(_request, response) {
    this.count += 1;

    const messageModal = new Message();
    const notFormatted = await messageModal.listAll();

    const messages = notFormatted.map(formatMessage);

    return response.render('chat.html', { messages });
  }
}

module.exports = MessageController;
