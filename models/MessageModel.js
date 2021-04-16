const connection = require('./connection');

const createMessage = async (messageFromSocket) => {
    const { nickname, message, timestamp } = messageFromSocket
    console.log('message', message)
    // const {  } = message;
    const { ops: queryResult } = await connection().then((db) => db
    // await connection().then((db) => db
      .collection('messages')
      .insertOne({ nickname, message, timestamp }));
//     const createdUser = { user: queryResult[0] };
  

//     return createdUser;
  };

const findAllMessages = async () => (
    connection().then((db) => db
      .collection('messages')
      .find(
        {},
        {
          fields: {
            _id: 0,
            email: 1,
          },
        },
      )
      .toArray())
  );

  module.exports = {
    createMessage,
    findAllMessages,
  };