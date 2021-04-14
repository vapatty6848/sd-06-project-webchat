const messageModel = require('../models/messages');

const create = async (req, res) => {
  const { nickname, message } = req.body;

  const newMessage = await messageModel.create(nickname, message);

  return res.render('homeView', { newMessage });
};

const getAll = async (req, res) => {
  const allMessages = await messageModel.getAll();

  return res.render('homeView', { allMessages });
};

module.exports = {
  create,
  getAll,
};
