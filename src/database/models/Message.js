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

  // async find(userID) {
  //   const db = await connection();

  //   const [userData] = await db.collection('users').find(mongodb.ObjectId(userID)).toArray();

  //   if (!userData) {
  //     throw new AppError('User not found.', 404);
  //   }

  //   delete userData.password;

  //   return userData;
  // }

  // async update(userInfo) {
  //   const { first_name, last_name, email, password, id } = userInfo;

  //   const db = await connection();

  //   const userData = await db.collection('users').findOne(mongodb.ObjectId(id));

  //   if (!userData) {
  //     throw new AppError('User not found.', 404);
  //   }

  //   const newUserData = {
  //     ...userData,
  //     first_name,
  //     last_name,
  //     email,
  //     password: password ? password : userData.password,
  //   }

  //   await db.collection('users').updateOne(
  //     { _id: mongodb.ObjectId(id) },
  //     { $set: newUserData },
  //   );

  //   const updatedInfo = await db.collection('users').findOne(mongodb.ObjectId(id));

  //   delete updatedInfo.password;

  //   return updatedInfo;
  // }

  // async delete(userID) {
  //   const db = await connection();

  //   const userData = await db.collection('users').findOne(mongodb.ObjectId(userID));

  //   if (!userData) {
  //     throw new AppError('User not found.', 404);
  //   }

  //   await db.collection('users').deleteOne(
  //     { _id: mongodb.ObjectId(userID) },
  //   );
  // }
}

module.exports = Message;
