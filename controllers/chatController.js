const { Router } = require('express');

const router = Router();
const chatModel = require('../models/chatModel');

router.get('/', async (req, res) => {
  const messages = await chatModel.getAll();
  // console.log(messages);
  
  res.status(200).render('chatView');
});

module.exports = router;
