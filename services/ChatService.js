const ChatModel = require('../models/ChatModel');

const CreateMessage = async (message) => {
  const messageCreated = await ChatModel.CreateOne(message);
  return messageCreated;
};

const getAllMessages = async () => {
  const data = await ChatModel.getAll();
  return data.map((message) => message.message);
};

const getMessageById = async () => {

};

module.exports = {
  CreateMessage, getAllMessages, getMessageById,
};