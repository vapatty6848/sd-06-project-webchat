const router = require('express').Router();
const Model = require('../models/Messages');

router.get('/', async (req, res) => {
    const messages = await Model.getAllMessages();
    const formatedMessages = messages
    .map((message) => `${message.timestamp} - ${message.nickname}: ${message.message}`);
    
    if (!messages) return res.status(200).render('home');

    res.status(200).render('home', { formatedMessages });
});

module.exports = router;