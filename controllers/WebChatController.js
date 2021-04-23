const { Router } = require('express');
const { getAllMessages } = require('../models/Messages');

const WebChatController = new Router();

WebChatController.get('/', async (req, res) => {
  const messages = await getAllMessages();

  const setMessages = messages
  .map((message) => `${message.timestamp} - ${message.nickname}: ${message.message}`);

  if (!setMessages) return res.status(200).render('index'); 

  res.status(200).render('index', { setMessages }); 
});

module.exports = WebChatController;