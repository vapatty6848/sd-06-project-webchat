const { Router } = require('express');

const MessageController = require('../controllers/MessageController');

const messageRoutes = Router();

const messageController = new MessageController();

messageRoutes.get('/', messageController.render);

module.exports = messageRoutes;
