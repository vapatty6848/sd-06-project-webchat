const connection = require('./connection');

const createMessage = async (chatMessage, name, date) => {
  await connection().then((db) => {
    db.collection('messages').insertOne({
      message: chatMessage,
      nickname: name,
      timestamp: date,
    });
  });
};

const getAllMessages = async () => connection()
    .then((db) => db.collection('messages').find().toArray());

module.exports = {
  createMessage,
  getAllMessages,
};
