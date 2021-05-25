const connection = require('./connection');

const addMessage = async (data) => {
  const db = await connection();
  const a = await db.collection('messages').insertOne(data);
  return a.ops[0];
};

const getMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  return messages;
};

module.exports = {
  addMessage,
  getMessages,
};
