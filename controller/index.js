const { getAll } = require('../models/Messages');

const ChatController = async (req, res) => {
  const messages = await getAll();
  res.status(200).render('index', { messages });
};

module.exports = ChatController;