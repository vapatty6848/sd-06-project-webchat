const { StatusCodes } = require('http-status-codes');
const chat = require('../models');

const create = async (req, res) => {
  try {
    const { body } = req;
    console.log('post req body: ', body);
    // const newMessage = await chat.create(body.message);
    // res.status(StatusCodes.CREATED).json(newMessage);
    res.status(StatusCodes.CREATED).json('OK');
  } catch (err) {
    throw new Error(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await chat.getAll();
    console.log('get /:', messages);
    res.status(StatusCodes.OK).render('index', messages);
  } catch (err) {
    return next({ err });
  }
};

module.exports = {
  create,
  getMessages,
};