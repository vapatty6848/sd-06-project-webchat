const io = window.io('http://localhost:3000');

const button = document.querySelector('#sendButton');
const messageList = document.querySelector('#messagesList');

button.addEventListener('click', () => {
  const { NICKNAME: nickname } = window.window.globalVariables;
  const textBox = document.querySelector('#messageInput');
  const chatMessage = textBox.value;
  io.emit('message', { chatMessage, nickname });
  textBox.value = '';
  return false;
});

const renderMessage = (message) => {
  const newMessage = document.createElement('li');
  newMessage.setAttribute('class', 'chatMessage');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerHTML = message;
  messageList.appendChild(newMessage);
};

io.on('message', (message) => renderMessage(message));
