const MessagesController = require('express').Router();
const { getAll, create } = require('../models/MessagesModel');

MessagesController.get('/', async (req, res) => {
  const allMessages = await getAll();

  res.render('home', { allMessages });
});

const saveMessage = async (message) => {
  await create(message);
};

module.exports = {
  MessagesController,
  saveMessage,
};
