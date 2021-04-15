const { users } = require('../models');

const createOrUpdate = async (user, prevuser, socketId) => {
  try {
    await users.createOrUpdate(user, prevuser, socketId);
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (socketId) => {
  try {
    await users.remove(socketId);
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

const getAll = async () => {
  try {
    const usersOnline = await users.getAll();
    return usersOnline;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createOrUpdate,
  remove,
  getAll,
};