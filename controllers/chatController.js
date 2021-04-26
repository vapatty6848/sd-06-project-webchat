const express = require('express');

const router = express.Router();

const chatModel = require('../models/chatModel');

router.get('/', async (_req, res) => {
  console.log('controller, getAll');
  const messages = await chatModel.getAllMessages();
  const formatedMessages = await messages
    .map((message) => `${message.timestamp} - ${message.nickname}: ${message.message}`);

    res.render('home', { formatedMessages });
});

module.exports = router;
