const connection = require('./connection');

class Message {
  async create(queryParams) {
    this.count += 1;
    const db = await connection();

    const modelCreated = await db.collection('messages').insertOne(queryParams);

    const [model] = modelCreated.ops;
    return model;
  }

  async findAll() {
    this.count += 1;
    const db = await connection();

    const modelsFound = await db.collection('messages').find().toArray();

    return modelsFound;
  }
}

module.exports = Message;