const { clearDB } = require('../models');

const clear = async () => {
  try {
    await clearDB.clear();
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  clear,
};