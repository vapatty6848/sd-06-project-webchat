const usersOnline = [];

module.exports = (io, socket) => {
  let userName;
  const userLogin = async ({ user, prevUser = '' }) => {
    const findUser = usersOnline.indexOf(prevUser);
    if (findUser >= 0) { usersOnline.splice(findUser, 1); }
    userName = user.slice();
    usersOnline.push(userName);
    io.emit('usersOnline', usersOnline);
    console.log('usuário logado.');
  };

  const logOff = async () => {
    const findUser = usersOnline.indexOf(userName);
    if (findUser >= 0) { usersOnline.splice(findUser, 1); }
    io.emit('usersOnline', usersOnline);
    console.log('Usuário saiu do chat.');
  };

  socket.on('userLogin', userLogin);
  socket.on('disconnect', logOff);
};
