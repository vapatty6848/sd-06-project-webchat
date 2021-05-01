const moment = require('moment');

const connection = require('./connection');

const create = async (data) => {
  try {
    const db = await connection();

    const message = {
      ...data,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    };

    const response = await db.collection('messages').insertOne(message);

    return response.ops[0];
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const get = async () => {
  try {
    const db = await connection();

    const messages = await db.collection('messages').find({}).toArray();

    return messages;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

module.exports = {
  create,
  get,
};