const connection = require('./connection');

const addMessage = async ({ chatMessage, nickname, timestamp }) => connection()
  .then(async (db) => {
    await db.collection('messages').insertOne({ chatMessage, nickname, timestamp });
  });

  const getAllMessages = async () => {
    const allMessages = await connection()
      .then((db) => db.collection('messages').find().toArray());
    return allMessages;
  };

module.exports = {
  addMessage,
  getAllMessages,
};
