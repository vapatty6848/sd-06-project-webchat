const connection = require('./connection');

const createMessage = async (messageFromSocket) => {
    const { nickname, message, timestamp } = messageFromSocket;
    console.log('message', message);
    await connection().then((db) => db
      .collection('messages')
      .insertOne({ nickname, message, timestamp }));
  };

const findAllMessages = async () => (
    connection().then((db) => db
      .collection('messages')
      .find(
        {},
        {
          fields: {
            _id: 0,
          },
        },
      )
      .toArray())
  );

  module.exports = {
    createMessage,
    findAllMessages,
  };