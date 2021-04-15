const express = require('express');

const controller = require('../controllers/chat.controllers');

const chatRouter = express.Router();

// chatRouter.post('/', controller.create);
chatRouter.get('/', controller.getMessages);

module.exports = chatRouter;