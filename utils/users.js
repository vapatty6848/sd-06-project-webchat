const users = [];

const getAllUsers = () => users;

const userJoin = (id, nickname) => {
  const user = { id, nickname };
  users.push(user);

  return nickname;
};

const changeUserNickname = (id, nickname) => {
  const user = users.find((usr) => usr.id === id);
  const index = users.findIndex((usr) => usr.id === id);

  user.nickname = nickname;
  users[index] = user;

  return user;
};

const userDisconnect = (id) => {
  const index = users.findIndex((user) => user.id === id);

  users.splice(index, 1);

  return users;
};

module.exports = {
  getAllUsers,
  userJoin,
  changeUserNickname,
  userDisconnect,
};
