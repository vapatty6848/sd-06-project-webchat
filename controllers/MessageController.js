const { Router } = require('express');
const messagesModel = require('../models/messagesModel');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    const newMessage = await messagesModel.create(message);

    return res.status(200).send(newMessage);
  } catch (e) {
    return res.status(500).json({ message: 'internal error' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const messages = await messagesModel.getAll();

    return res.status(200).render('index', { messages });
  } catch (e) {
    return res.status(500).json({ message: 'internal error' });
  }
});

module.exports = router;
