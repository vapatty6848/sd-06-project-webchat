const connection = require('./connection');

const addMessages = async ({ chatMessage, nickname, date }) => connection()
  .then(async (db) => {
  const newMessage = await db.collection('messages').insertOne({ chatMessage, nickname, date });
  return newMessage.ops[0];
});

const getAllMsgs = async () => connection()
  .then(async (db) => {
    const allMessages = await db.collection('messages').find().toArray();
    return allMessages;
  });

module.exports = {
  addMessages,
  getAllMsgs,
};
