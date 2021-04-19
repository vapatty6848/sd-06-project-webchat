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
// gravando msg no banco n formato esperado e fazendo uma listagem de todas as msgs