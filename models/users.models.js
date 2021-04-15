const connection = require('./connection');

const createOrUpdate = async (user, lastUpdate, socketId) => {
  const query = { socketId };
  const update = { $set: { user, lastUpdate } };
  const options = { upsert: true };
  await connection()
      .then((db) => db.collection('usersOnline').updateOne(query, update, options))
      .catch((err) => console.log(err));
  return true;
};

const remove = async (socketId) => {
  await connection()
    .then((db) => db.collection('usersOnline').deleteOne({ socketId }))
    .catch((err) => console.log(err));
  return true;
};

const getAll = async () => {
    const result = await connection()
      .then((db) => db.collection('usersOnline').find().toArray())
      .catch((err) => console.log(err));
    return result;
};

module.exports = {
  createOrUpdate,
  remove,
  getAll,
};