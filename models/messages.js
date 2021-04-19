const connection = require('./connection');

const collectionName = 'messages';

const saveMessage = async ({ chatMessage, nickname, timestamp }) => (
  connection().then((db) => db.collection(collectionName)
  .insertOne({ chatMessage, nickname, timestamp }))
);

const getAll = async () => {
  const allMessages = await connection()
  .then((db) => db.collection(collectionName).find().toArray());

  return allMessages;
};

module.exports = { saveMessage, getAll }; 
