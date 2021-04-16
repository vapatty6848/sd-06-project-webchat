const textBox = document.querySelector('#messageInput');

const button = document.querySelector('#sendButton');

button.addEventListener('click', () => {
  socket.emit('receiveMessage', textBox.value);
  textBox.value = '';
  return false;
});
