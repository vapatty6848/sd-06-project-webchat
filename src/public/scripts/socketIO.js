const socket = window.io('http://localhost:3000');

const messageForm = document.getElementById('send-message');
const inputMessage = document.getElementById('message-input');
const nicknameForm = document.getElementById('set-nickname');
const nicknameInput = document.getElementById('nickname-input');

function generateRandomNickname() {
  const possibleChars = 'abcdefghijklmnopqrstuvwyxz1234567890';

  let nickname = '';

  const NICKNAME_SIZE = 16;
  const POSSIBLE_INDEXES = 35;
  const iterator = Array.from({ length: NICKNAME_SIZE }, (_, index) => index);

  iterator.forEach((_) => {
    const index = Math.floor(Math.random() * POSSIBLE_INDEXES);

    const char = possibleChars[index];

    nickname += char;
  });

  return nickname;
}

function saveNickname(nickname) {
  localStorage.setItem('nickname', nickname);
}

function getNickname() {
  let nickname = localStorage.getItem('nickname');

  if (!nickname) nickname = generateRandomNickname();

  saveNickname(nickname);

  nicknameInput.value = nickname;

  return nickname;
}

let nickname = getNickname();

function addUser(userName) {
  const usersList = document.getElementById('online-users');

  const userContainer = document.createElement('li');

  if (userName === nickname) {
    userContainer.setAttribute('data-testid', 'online-user');
  }

  userContainer.innerText = userName;

  usersList.appendChild(userContainer);
}

function addAllUsers(users) {
  users.forEach((user) => addUser(user.nickname));
}

function clearUsers() {
  const allUsers = document.querySelectorAll('.online-user');

  allUsers.forEach((user) => user.remove());
}

function renewUsers(newUsers) {
  clearUsers();
  addAllUsers(newUsers);
}

let connectedUsers = [];

socket.emit('newUser', nickname);

socket.on('users', (users) => {
  connectedUsers = users;
  renewUsers(users);
});

socket.on('newUser', (user) => {
  connectedUsers = [...connectedUsers, user];
  renewUsers(connectedUsers);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const chatMessage = inputMessage.value;

  if (chatMessage) {
    const msg = { nickname, chatMessage };

    socket.emit('message', msg);

    inputMessage.value = '';
  }
});

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newNickname = nicknameInput.value;

  if (newNickname) {
    nickname = newNickname;
    saveNickname(newNickname);

    socket.emit('newNickname', newNickname);

    const [user, ...otherUsers] = connectedUsers;
    user.nickname = newNickname;
    connectedUsers = [user, ...otherUsers];
    renewUsers(connectedUsers);
  }
});

socket.on('newNickname', (user) => {
  connectedUsers = connectedUsers.map((connected) => {
    if (connected.id !== user.id) return connected;

    return user;
  });

  renewUsers(connectedUsers);
});

socket.on('logout', (user) => {
  connectedUsers = connectedUsers.filter(({ id }) => id !== user.id);

  renewUsers(connectedUsers);
});

const createMessage = (message) => {
  const messagesContainer = document.getElementById('messages');

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message');

  const messageText = document.createElement('span');
  messageText.setAttribute('data-testid', 'message');
  messageText.innerText = message;

  messageContainer.appendChild(messageText);
  messagesContainer.appendChild(messageContainer);
};

socket.on('message', (msg) => createMessage(msg));
