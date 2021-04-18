const chat = require('../models/chatModel');

const create = async (message) => {
  try {
    await chat.create(message);
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await chat.getAll();
    res.status(200).render('../view/', { messages: JSON.stringify(messages) });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  create,
  getMessages,
};
