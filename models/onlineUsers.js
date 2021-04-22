const { model } = require('mongoose');
const onlineUsersSchema = require('../schemas/onlineUsersSchema');

const OnlineUsers = model('OnlineUsers', onlineUsersSchema);

const addUser = (nickname, socketId) => {
  const insertion = new OnlineUsers({ nickname, socketId });

  insertion.save();
};

const updateUser = async (nickname, socketId) => {
  await OnlineUsers.findOneAndUpdate({ socketId }, { nickname }, {
    new: true,
  });
};

const deleteUser = async (socketId) => {
  await OnlineUsers.deleteOne({ socketId });
};

const getAll = () => {
  const result = OnlineUsers.find((err, users) => {
    if (err) console.log(err);
    return users;
  });

  return result;
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  getAll,
};
