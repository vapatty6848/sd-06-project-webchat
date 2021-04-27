const io = window.io('http://localhost:3000');

const button = document.querySelector('#sendButton');
const messageList = document.querySelector('#messagesList');
const nicknameButton = document.querySelector('#nicknameButton');
const usersList = document.querySelector('#online-users');

const initialNickname = document.querySelector('#userName');
initialNickname.innerText = window.window.globalVariables.NICKNAME;

const appendUser = (nickname, id) => {
  const li = document.createElement('li');
  li.innerText = nickname;
  li.setAttribute('data-testid', 'online-user');
  li.setAttribute('id', id);
  usersList.appendChild(li);
};

nicknameButton.addEventListener('click', () => {
  const nicknameInput = document.querySelector('#nicknameInput');
  const nicknameDisplay = document.querySelector('#userName');
  window.window.globalVariables.NICKNAME = nicknameInput.value;
  io.emit('updateNickname', { nickname: nicknameInput.value });
  nicknameDisplay.innerText = window.window.globalVariables.NICKNAME;
  nicknameInput.value = '';
});

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

const renderUsers = (users) => {
  users.forEach(({ nickname, id }) => {
    appendUser(nickname, id);
  });
};

const renderNewUser = ({ nickname, id }) => {
  appendUser(nickname, id);
};

const updateOtherUser = (newUser) => {
  const { id: userId } = newUser;
  const { nickname: newNickname } = newUser;
  const changedUser = document.querySelector(`#${userId}`);
  changedUser.innerText = newNickname;
};

const removeUser = (userId) => {
  const disconnectedUser = document.querySelector(`#${userId}`);
  if (disconnectedUser) disconnectedUser.parentNode.removeChild(disconnectedUser);
};

io.emit('login', { nickname: initialNickname.innerText });
io.on('message', (message) => renderMessage(message));
io.on('getUsers', (users) => renderUsers(users));
io.on('newUser', (user) => renderNewUser(user));
io.on('updatedUser', (user) => updateOtherUser(user));
io.on('userDisconnected', (disconnectedUser) => removeUser(disconnectedUser));
