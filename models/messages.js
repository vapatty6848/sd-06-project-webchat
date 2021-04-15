const connection = require('./connection');

const addMessages = async (data) => connection()
  .then(async (db) => {
  const newMessage = await db.collection('messages').insertOne(data);
  return newMessage.ops[0];
});

const getAllMessages = async () => connection()
  .then(async (db) => {
    const allMessages = await db.collection('messages').find().toArray();
    return allMessages;
});

module.exports = {
  addMessages,
  getAllMessages,
};
