const connection = require('./connection');

const createUser = async (id, nickname) => {
  const db = await connection();
  db.colletion('users').insertOne({ id, nickname });
};

const updateUser = async (id, nickname) => {
  const db = await connection();
  db.colletion('users').updateOne({ id }, { nickname });
};

module.exports = { createUser, updateUser };
