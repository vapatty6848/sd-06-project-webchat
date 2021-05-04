const connection = require('./connection');

// Requisito-1
const create = async (id, nickname) => {
    const user = await connection()
      .then((db) => db.collection('users').insertOne({ id, nickname }));
    return (user.ops[0]);
  };

  // Requisito-2
  const updateNickname = async ({ id, nickname }) => {
    const update = await connection()
      .then((db) => db.collection('users')
      .findOneAndUpdate(
        { id },
        { $set: { nickname } },
        { returnOriginal: false },
      ));
    return update.value;
  };

  // https://stackoverflow.com/questions/35626040/findoneandupdate-used-with-returnnewdocumenttrue-returns-the-original-document

  module.exports = {
    create,
    updateNickname,
  };  