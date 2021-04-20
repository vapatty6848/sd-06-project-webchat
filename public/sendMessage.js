const io = window.io('http://localhost:3000');

const generateRandomName = (length) => {
  let name = '';
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 1; index <= length; index += 1) {
    name += charset[Math.floor(Math.random() * charset.length)];
  }
  return name;
};

const nickname = generateRandomName(16);

const button = document.querySelector('#sendButton');

button.addEventListener('click', () => {
  const textBox = document.querySelector('#messageInput');
  const chatMessage = textBox.value;
  io.emit('message', { chatMessage, nickname });
  textBox.value = '';
  return false;
});
