const connection = require('./connection');

const getMSG = async () => {
  const result = await connection()
    .then((db) => db
      .collection('messages')
      .find().toArray());
  return result;
};

const insertMSG = async (message) => {
  const result = await connection()
    .then((db) => db
      .collection('messages')
      .insertOne(message));
  return result;
};

module.exports = {
  insertMSG,
  getMSG,
};
