const { Router } = require('express');
const MessagesModel = require('../models/messagesModel');
const helpers = require('../helpers');
require('../models/connection');

const controller = Router();
// const SUCCESS = 200;

controller.get('/', async (_req, res) => {
  const messages = await MessagesModel.getAll();
  res.render('webchat/chat', { messages, helpers });
});

module.exports = controller;
