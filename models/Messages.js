// const connection = require('./connection');

// const createUser = async (name, email, password) => {
//   const role = 'user';
//   const { insertedId } = await connection()
//     .then((db) => db.collection('users').insertOne({ name, email, password, role }));
//   return {
//     user: {
//       name,
//       email,
//       role,
//       _id: insertedId,
//     },
//   };
// };

// const getAllUsers = async () => connection().then((db) => db.collection('users').find().toArray());

// const findUserByEmail = async (email) => connection()
//   .then((db) => db.collection('users').findOne({ email }));

// const findUserById = async (id) => connection()
//   .then((db) => db.collection('users').findOne(ObjectID(id)));

// const updateUser = async (id, name, quantity) => {
//   connection().then((db) => db.collection('users').updateOne(
//     { _id: ObjectID(id) },
//     { $set: { name, quantity } },
//   ));

//   return {
//     _id: id,
//     name,
//     quantity,
//   };
// };

// const removeUser = async (id) => connection()
//     .then((db) => db.collection('products').deleteOne({ _id: ObjectID(id) }));

// module.exports = {
//   createUser,
//   findUserByEmail,
//   getAllUsers,
//   findUserById,
//   updateUser,
//   removeUser,
// }; 