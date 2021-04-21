const connection = require('./connection');

const collection = 'messages';

const create = async (message, nickname, timestamps) => {
  const insertion = await connection()
    .then((db) => db.collection(collection).insertOne({
      message,
      nickname,
      timestamps,
    }));

  console.log(insertion);
};

module.exports = {
  create,
};
