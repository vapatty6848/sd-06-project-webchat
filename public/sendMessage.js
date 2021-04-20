const io = window.io('http://localhost:3000');

const button = document.querySelector('#sendButton');

button.addEventListener('click', () => {
  const { NICKNAME: nickname } = window.window.globalVariables;
  const textBox = document.querySelector('#messageInput');
  const chatMessage = textBox.value;
  io.emit('message', { chatMessage, nickname });
  textBox.value = '';
  return false;
});
