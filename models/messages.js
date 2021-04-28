const connection = require('./connection');

const newMessages = async ({ chatMessage, nickname, date }) => connection()
  .then(async (db) => {
  const newMessage = await db.collection('messages').insertOne({ chatMessage, nickname, date });
  return newMessage.ops[0];
});

const allMessages = async () => connection()
  .then(async (db) => {
    const getAllMessages = await db.collection('messages').find().toArray();
    return getAllMessages;
  });

module.exports = {
  newMessages,
  allMessages,
};