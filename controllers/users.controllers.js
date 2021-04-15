const { users } = require('../models');

const createOrUpdate = async (user, socketId) => {
  try {
    await users.createOrUpdate(user, socketId);
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (user) => {
  try {
    await users.remove(user);
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