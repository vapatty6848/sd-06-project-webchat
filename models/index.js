const connection = require('./connection');

const create = async (message) => {
  const { insertedId } = await connection()
    .then((db) => db.collection('messages').insertOne(message))
    .catch((err) => err);

  return { id: insertedId, ...message };
};

const getAll = async () => {
    const result = await connection()
      .then((db) => db.collection('messages').find().toArray());

    return result;
};

module.exports = {
  create,
  getAll,
};