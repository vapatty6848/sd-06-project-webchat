// const io = window.io('http://localhost:3000');
// import randomName from 'random-name';

const socket = io();

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
  const messageContent = textBox.value;
  socket.emit('message', { messageContent, nickname });
  textBox.value = '';
  return false;
});
