const { Router } = require('express');
const ChatService = require('../services/ChatService');

const ChatController = Router();

ChatController.get('/', async (req, res) => {
  try {
    const messages = await ChatService.getAllMessages();
    console.log(messages);
    res.render('index', { messages });
  } catch (err) {
    console.log(err, 'falhou');
    res.status(500).json({ message: 'internal server error' });
  }
  console.log('entrei');
});

module.exports = ChatController;