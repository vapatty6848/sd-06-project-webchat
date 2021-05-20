// const socket = window.io('http://localhost:3000');

// let nickname = '';

// const ZERO = 0;
// const ONE = 1;
// const NICKNAME_SIZE = 16;

// const currentUser = document.getElementById('current-user');
// const onlineUsersUl = document.getElementById('online-users-ul');
// const messageBox = document.getElementById('message-box');
// const sendMessageBtn = document.getElementById('send-message');
// const chatBoxUl = document.getElementById('chat-box');
// const nickInput = document.getElementById('nick-input');
// const sendNickBtn = document.getElementById('send-nick');

// sendMessageBtn.addEventListener('click', () => {
//   const message = messageBox.value;
//   socket.emit('message', { chatMessage: message, nickname });
// });

// sendNickBtn.addEventListener('click', () => {
//   const newNickname = nickInput.value;
//   nickname = newNickname;
//   currentUser.innerHTML = nickname;
//   socket.emit('newNickname', nickname);
// });

// socket.on('connect', () => {
//   nickname = (socket.id).slice(ZERO, NICKNAME_SIZE);
//   socket.emit('newUser', nickname);
//   currentUser.innerHTML = nickname;
// });

// socket.on('updateUsers', (users) => {
//   const userLogged = users.find((user) => user.id === socket.id);
//   const userIndex = users.findIndex((user) => user === userLogged);
//   users.splice(userIndex, ONE);
//   users.unshift(userLogged);

//   onlineUsersUl.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerHTML = user.nickname;
//     li.setAttribute('data-testid', 'online-user');
//     onlineUsersUl.appendChild(li);
//   });
// });

// socket.on('message', (message) => {
//   const li = document.createElement('li');
//   li.innerHTML = message;
//   li.setAttribute('data-testid', 'message');
//   chatBoxUl.appendChild(li);
// });
