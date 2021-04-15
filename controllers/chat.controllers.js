const { StatusCodes } = require('http-status-codes');

const { chat } = require('../models');

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
    const messages = await chat.getAll();

    res.status(StatusCodes.OK).render('index', { messages: JSON.stringify(messages) });
  } catch (err) {
    return next({ err });
  }
};

module.exports = {
  create,
  getMessages,
};