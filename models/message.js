const connection = require('./connection');

const createMsg = async (msgData) => {
  const result = await connection().then((db) =>
    db.collection('messages').insertOne(msgData));
  return result;
};

module.exports = createMsg;