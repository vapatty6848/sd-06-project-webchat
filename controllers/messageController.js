const { Router } = require('express');
const moment = require('moment');
const messageModel = require('../models/messageModel');

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const arrOfMsgs = await messageModel.getAllMessages();

    const messages = arrOfMsgs.map((msg) => {
      const date = moment(msg.timestamp).format('DD-MM-yyyy hh:mm:ss');

      return `${date} ${msg.nickname} ${msg.chatMessage}`;
    });

    return res.status(200).render('index', { messages });
  } catch (e) {
    return res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;