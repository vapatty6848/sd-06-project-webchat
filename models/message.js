const connection = require('./connection');

const createMessage = async (message, nickname) => {
  const newMessage = await connection()
    .then((db) => db.collection('message').insertOne({
      nickname,
      message,
      timestamp: Date.now(),
    }));

  return newMessage;
};

const getAllMessages = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('message').find().toArray());

  return allMessages;
};

module.exports = {
  createMessage,
  getAllMessages,
};
