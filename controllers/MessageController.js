const { Router } = require('express');
const moment = require('moment');
const messagesModel = require('../models/messagesModel');

const router = Router();

// router.post('/', async (req, res) => {
//   try {
//     const { message } = req.body;

//     const newMessage = await messagesModel.create(message);

//     return res.status(200).send(newMessage);
//   } catch (e) {
//     return res.status(500).json({ message: 'internal error' });
//   }
// });

router.get('/', async (_req, res) => {
  try {
    const arrayOfMessages = await messagesModel.getAll();
    console.log(arrayOfMessages);

    const messages = arrayOfMessages.map((msg) => {
      const date = moment(msg.timestamp).format('DD-MM-yyyy hh:mm:ss');

      return `${date} ${msg.nickname} ${msg.chatMessage}`;
    });

    return res.status(200).render('index', { messages });
  } catch (e) {
    return res.status(500).json({ message: 'internal error' });
  }
});

module.exports = router;
