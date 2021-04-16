const { StatusCodes } = require('http-status-codes');

const { chat } = require('../models');
const { setupMessages } = require('../utils');

const create = async (message) => {
  try {
    await chat.create(message);
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messagesStored = await chat.getAll();
    const messages = messagesStored.map((message) => {
      const { messageStored } = setupMessages(message);
      return messageStored;
    });
    res.status(StatusCodes.OK).render('index', { messages });
  } catch (err) {
    return next({ err });
  }
};

module.exports = {
  create,
  getMessages,
};