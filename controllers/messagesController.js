const { Router } = require('express');
const messagesModel = require('../models/messages');

const router = Router();

router.get('/', async (_req, res) => {
  const allMessages = await messagesModel.getAll();

  res.status(200).render('index', { allMessages });
});

router.post('/', async (req, res) => {
  const { message, nickname, timestamp } = req.body;

  const { insertedId } = await messagesModel.create(message, nickname, timestamp);

  const newMessage = {
    _id: insertedId,
    message,
    nickname,
    timestamp,
  };

  res.status(201).json(newMessage);
});

module.exports = router;