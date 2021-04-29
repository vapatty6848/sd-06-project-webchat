const connection = require('./connection');

const get = async () => {
  const msgs = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return msgs;
};

module.exports = {
  get,
};
