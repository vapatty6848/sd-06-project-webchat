const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  db.collection('messages').insertOne({ message, nickname, timestamp });
};

module.exports = { createMessage };
