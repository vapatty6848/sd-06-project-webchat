const { Router } = require('express');
const model = require('../models/model');

const router = Router();

router.get('/getmessages', async (req, res) => {
  const allMessages = await model.getAllMessages();
  return res.status(200).json(allMessages);
});

module.exports = router;
