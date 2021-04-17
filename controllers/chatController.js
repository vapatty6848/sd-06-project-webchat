const { Router } = require('express');

const router = Router();
const chatModel = require('../models/chatModel');

router.get('/', async (req, res) => {
  // const messages = await chatModel.getAll();
  // console.log(messages);  
  res.status(200).render('chatView');
});

router.get('/messages', async (req, res) => {
  const messages = await chatModel.getAll();
  // console.log(messages);
  
  res.status(200).json(messages);
});

router.post('/', async (req, res) => {
  await chatModel.create(req.body);
  
  res.status(200).json({});
});

module.exports = router;
