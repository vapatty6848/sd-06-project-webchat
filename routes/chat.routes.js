const express = require('express');

const chat = require('../controllers/chat');

const chatRouter = express.Router();

chatRouter.post('/', chat.create);
chatRouter.get('/search', chat.getMessages);

module.exports = chatRouter;