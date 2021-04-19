const { Router } = require('express');
const model = require('../models/Messages');

const router = Router();

router.get('/messages', async (req, res) => {
  const allMessages = await model.getAllMessages();
  return res.status(200).json(allMessages);
});

module.exports = router;