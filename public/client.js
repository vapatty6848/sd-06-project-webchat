const socket = window.io('http://localhost:3000/');
socket.emit('userConnected', Math.random() * 5);
// socket.on('messageReceived', (data) => {
  // console.log(data);
// });
socket.on('usersConnected', (data) => console.log(data));

const logoutButton = document.querySelector('#logout-btn');
const sendButton = document.querySelector('#send-btn');
const messageInput = document.querySelector('#msg');
const messageRender = document.querySelector('#messages');
// const nick = document.querySelector('#nickname');

logoutButton.addEventListener('click', () => {
  socket.disconnect();
});

sendButton.addEventListener('click', () => {
  const chatMessage = messageInput.value;
  // const nickname = nick.value;

  socket.emit('message', { chatMessage });
});
socket.on('message', (message) => {
  const li = document.createElement('li');
  li.innerHTML(message)
  console.log(message)
});

window.onbeforeunload = () => {
  socket.disconnect();
  return false;
};