const { Router } = require('express');

const router = Router();

const webChatModel = require('../models/webChatModel');

router.get('/', async (_req, res) => {
  const messages = await webChatModel.getAll();
  res.status(200).render('index', { messages });
});
router.post('/', async (req, res) => {
    await webChatModel.create(req.body);
    res.status(200).json({ enviado: 'ok' });
  });

module.exports = router;
