const { Router } = require('express');
const messagesModel = require('../models/Messages');

const router = Router();

// Requisito-3
router.get('/messages', async (req, res) => {
  const dbMessages = await messagesModel.getAll();
  console.log(dbMessages);
  return res.status(200).json(dbMessages);
});

module.exports = router;
