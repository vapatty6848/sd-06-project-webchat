const connection = require('./connection');

const addMessages = async ({ chatMessage, nickname, timestamp }) => connection()
  .then(async (db) => {
  await db.collection('messages').insertOne({ chatMessage, nickname, timestamp });
});

const getAllMsgs = async () => {
  const allMsgs = await connection().then((db) => db.collection('messages').find().toArray());
  return allMsgs;
};

module.exports = {
  addMessages,
  getAllMsgs,
};
