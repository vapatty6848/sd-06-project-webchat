const { Router } = require('express');

const { chatController } = require('./controllers');

const routerMessage = Router();

routerMessage.get('/', chatController.renderMessages);

module.exports = routerMessage;