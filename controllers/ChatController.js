const { Router } = require('express');
const Messages = require('../models/Messages');

const router = Router();

router.get('/', async (request, response) => {
  const retrievedMessages = await Messages.getAll();
  const messages = retrievedMessages.map(({ message, nickname, timestamp }) => (
    `${timestamp} - ${nickname}: ${message}`
  ));
  console.log('Database messages:', messages);

  return response.status(200).render('chat', { messages });
});

module.exports = router;
