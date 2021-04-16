const { Router } = require('express');
const webchat = require('../models/webchat');

const router = Router();

router.get('/', async (req, res) => {
  const messages = await webchat.getAll();
  res.status(200).render({ messages });
});

module.exports = router;
