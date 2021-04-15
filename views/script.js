let socket = io();

// profile
let nick = '';
const userSpan = document.querySelector('#username');
const userForm = document.querySelector('#user-form');
const userInput = document.querySelector('#name-input');
const usersUl = document.querySelector('#usersUl');

const createUserInList = (username) => {
  const li = document.createElement('li');
  li.innerText = username;
  // li.setAttribute('data-testid', 'message');
  usersUl.appendChild(li)
};

socket.on('connect', () => {
  nick = socket.id;
  userSpan.innerText = nick;
  
  socket.emit('userConnected');
});

socket.on('reloadUsersList', (userList) => {
  usersUl.innerHTML = '';
  userList.forEach(user => createUserInList(user));
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  nick = userInput.value;
  userSpan.innerText = nick;
  userInput.value = '';
  socket.emit('userChangedName', nick);
  return false;
});

// messages
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#messageInput');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  socket.emit('userMessage', { chatMessage: messageInput.value, nickname: nick });
  messageInput.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messagesUl');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li)
};

socket.on('message', (message) => createMessage(message));
