const socket = io();
const randomName = require('random-name');

const textBox = document.querySelector('#messageInput');
const button = document.querySelector('#sendButton');

button.addEventListener('click', () => {
  const messageContent = textBox.value;
  socket.emit('message', 'teste');
  textBox.value = '';
  return false;
});
