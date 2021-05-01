const connection = require('./connection');

const get = async () => {
  const msgs = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return msgs;
};

const create = async (msg) => {
  await connection()
    .then((db) => db.collection('messages').insertOne(msg))
    .catch((err) => console.error(err));
};

module.exports = {
  get,
  create,
};
