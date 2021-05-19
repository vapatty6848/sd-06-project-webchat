const socket = io();
let nickname = '';

const ZERO = 0;
const NICKNAME_SIZE = 16;

const currentUser = document.getElementById('current-user');
const onlineUsersUl = document.getElementById('online-users-ul');

socket.on('connect', () => {
  nickname = (socket.id).slice(ZERO, NICKNAME_SIZE);
  socket.emit('newUser', nickname);
  currentUser.innerHTML = nickname;
});

socket.on('updateUsers', (users) => {
  onlineUsersUl.innerHTML = ''
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = user.nickname;
    li.setAttribute('data-testid', 'online-user');
    onlineUsersUl.appendChild(li);
  });
});
