const connection = require('./connection');

const getAllMessages = async () => {
  const allMessages = await connection().then((db) => db.collection('messages').find().toArray());
  return allMessages;
 };

const newMessage = async ({ chatMessage, nickname, timestamp }) => {
  connection().then(async (db) => {
    await db.collection('messages').insertOne({ chatMessage, nickname, timestamp });
  });
};

module.exports = {
  newMessage,
  getAllMessages,
};