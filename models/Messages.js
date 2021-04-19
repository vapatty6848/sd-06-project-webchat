const connection = require('./connection');

async function create(message, nickname, timestamp) {
  const db = await connection();
  await db
    .collection('messages')
    .insertOne({ message, nickname, timestamp });
}

async function getAll() {
  const db = await connection();
  const queryResult = await db
    .collection('messages')
    .find()
    .toArray();
  return queryResult;
}

module.exports = {
  create,
  getAll,
};
