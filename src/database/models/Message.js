const connection = require('../connection.js');

class Message {
  async create(msg) {
    this.count += 1;

    const db = await connection();

    const queryInfo = await db.collection('messages').insertOne(msg);

    const [newMessage] = queryInfo.ops;

    return newMessage;
  }

  async listAll() {
    this.count += 1;

    const db = await connection();

    const messages = await db.collection('messages').find().toArray();

    return messages;
  }
}

module.exports = Message;
