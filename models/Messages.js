const connection = require('./connection');

const saveMsg = async ({ chatMessage, nickname, times }) => (
  connection().then((db) => db.collection('messages').insertOne({ chatMessage, nickname, times }))
);

const getAll = async () => {
  const allMsgs = await connection().then((db) => db.collection('messages').find().toArray());

  return allMsgs;
};

module.exports = {
  saveMsg,
  getAll,
};
