const connection = require('./connection');

// Criar Usuários
const createUser = async ({ id, nickname }) => {
  const newUser = await connection()
    .then((db) => db.collection('users').insertOne({ id, nickname }));

  return newUser;
};

// Listar todas as Usuários
const getAllUsers = async () => {
  const allUsers = await connection()
    .then((db) => db.collection('users').find({}).toArray());

  return allUsers;
};

module.exports = {
  createUser,
  getAllUsers,
};