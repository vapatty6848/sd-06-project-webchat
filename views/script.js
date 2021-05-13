// const socket = io();

// const form = document.getElementById('form');
// const input = document.getElementById('input-message');
// const inputNickname = document.getElementById('input-nickname');
// const btnNickname = document.getElementById('btn-nickname');

// btnNickname.addEventListener('click', () => {
//   sessionStorage.setItem('user', inputNickname.value);
// });

// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     if (input.value) {
//       const user = sessionStorage.getItem('user');
//       const messageObj = {
//         chatMessage: input.value,
//         nickname: user,
//       };
//         socket.emit('message', messageObj);
//         input.value = '';
//     }
// });

// const createMessage = (message) => {
//   const messageUl = document.getElementById('messages');
//   const li = document.createElement('li');
//   li.innerText = message;
//   messageUl.appendChild(li);
// };

// socket.on('receivedMessage', (message) => createMessage(message));
// socket.on('ola', (message) => createMessage(message));
// socket.on('message', (message) => createMessage(message));
