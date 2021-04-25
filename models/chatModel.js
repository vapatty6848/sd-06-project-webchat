const connection = require('./connection');

const postMsg = async ({ newDate, nickname, chatMessage }) => connection()
.then((db) => db.collection('messages')
.insertOne({ newDate, nickname, chatMessage }));

const getAllMsg = async () => {
  const msg = await connection().then((db) => db.collection('messages')
  .find().toArray());

  return msg;
};

module.exports = {
  postMsg,
  getAllMsg,
};