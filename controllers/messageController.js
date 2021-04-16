const { Router } = require('express');
const MessageModel = require('../models/messagesModel');
require('../models/connection');

const controller = Router();
const SUCCESS = 200;

controller.get('/', async (_req, res) => {
  res.render('webchat/chat');
});

controller.get('/messages', async (_req, res, _next) => {
    MessageModel.find((err, messages) => {
      if (err) console.log(err);
      return res.status(SUCCESS).json(messages);
    });
});

module.exports = controller;
