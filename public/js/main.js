const socket = window.io('http://localhost:3000');

let userNickname = '';

// user connects
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charList = chars.split('');
const charListLength = charList.length;

function sortCharIndex() {
  return Math.round(Math.random() * (charListLength - 1));
}

function generateNickname(nicknameSize) {
  const nicknameAggregator = [];
  for (let i = 1; i <= nicknameSize; i += 1) {
    const index = sortCharIndex();
    const char = charList[index];
    nicknameAggregator.push(char);
  }
  const nickname = nicknameAggregator.join('');
  return nickname;
}

const randomNickname = generateNickname(16);
console.log('Random nickname', randomNickname);
userNickname = randomNickname;
socket.emit('newConnection', randomNickname);

// Send message
const sendMessageForm = document.querySelector('.send-message');
sendMessageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const messageInput = document.querySelector('.send-message-input');
  const message = messageInput.value;
  console.log('Nickname que mandou mensagem: ', userNickname);
  console.log('Mensagem', message);
  socket.emit('message', { chatMessage: message, nickname: userNickname });
  messageInput.value = '';
  return false;
});

// Change nickname
const nicknameForm = document.querySelector('.change-nickname');
nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nicknameInput = document.querySelector('.nickname-input');
  const newNickname = nicknameInput.value;
  console.log(`${userNickname} mudou seu nickname para: ${newNickname}`);
  const socketId = socket.id;
  socket.emit('nickname.change', { socketId, newNickname });
  nicknameInput.value = '';
  return false;
});

function showChatMessage(message) {
  const messagesUl = document.querySelector('.messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
}

// Hello - checks connection
socket.on('hello', (nickname) => {
  console.log('Hello!!!');
  console.log(`Your id is ${socket.id}.`);
  console.log(`Your nickname is ${nickname}.`);
});

// Get messages from other users
socket.on('message', (message) => {
  showChatMessage(message);
});

// A client joins the chat or changes the nickname
socket.on('usersUpdate', (users) => {
  const sessionUser = users.find((user) => user.socketId === socket.id);
  userNickname = sessionUser.nickname;
  const filteredUsers = users.filter((user) => user.socketId !== socket.id);
  const usersToDisplay = [sessionUser, ...filteredUsers];

  const usersLi = document.querySelector('.users');
  usersLi.innerHTML = '';
  usersToDisplay.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.nickname;
    li.setAttribute('data-testid', 'online-user');
    if (user.nickname === userNickname) {
      // atribute to highlight element
    }
    usersLi.appendChild(li);
  });
});
