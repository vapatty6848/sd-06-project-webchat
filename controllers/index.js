const { Router } = require('express');
const messages = require('../models/messages');

const messageController = new Router();

messageController.post('/', async (req, res) => {
  const { message, nickname } = req.body;
  console.log('controller', message, nickname);
  await messages.insertMessage(message, nickname);

  res.status(201).json({ ok: true });
});

module.exports = messageController;
