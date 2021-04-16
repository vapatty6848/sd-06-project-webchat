const { Router } = require('express');
const model = require('../models/message');

const router = Router();

router.get('/getMessages', async (req, res) => {
  const allMessages = await model.getAllMessages();
  return res.status(200).json(allMessages);
});

module.exports = router;