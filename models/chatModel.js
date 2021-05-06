const connection = require('./connection');

const saveMsgs = async (messages) => {
  await connection()
    .then((db) => db.collection('messages').insertOne({ messages }));
};

const getMsgs = async () => {
  const msg = await connection()
  .then((db) => db.collection('messages').find({}).toArray());
  // console.log(msg);
  return msg;
};

module.exports = {
  getMsgs,
  saveMsgs,
};
