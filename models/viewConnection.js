const connection = require('./connection');

const updateMessage = async (userId, msg) => {
  await connection().then((db) => db.collection('messages').updateOne(
    { id: userId }, { messages: msg },
  ));
};

const getMessages = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages').find({}, { projection: { _id: 0 } }).toArray());
  return allMessages;
};

const insertMessage = async (msg) => {
  await connection()
    .then((db) => db.collection('messages').insertOne({ message: msg }));
};

module.exports = {
  updateMessage,
  getMessages,
  insertMessage,
};
