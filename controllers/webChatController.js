const { Router } = require('express');

const router = Router();

const webChatModel = require('../models/webChatModel');

router.get('/', async (req, res) => {
  const messages = await webChatModel.getAll();
  res.status(200).render('index', { messages });
});

module.exports = router;
