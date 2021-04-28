const connect = require('./connection');

const CreateOne = async (message) => {
  const db = await connect();
  const response = await db.collection('messages').insertOne(message);
  const [newMessage] = response.ops;
  return newMessage;
};

const getAll = async () => {
  const db = await connect();
  const messages = await db.collection('messages').find().toArray();
  return messages;
};

module.exports = {
  CreateOne, getAll,
};