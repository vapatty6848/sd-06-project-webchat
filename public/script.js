// Connection
const socket = io();

// GET FORM INPUT VALUE AND SEND IT
const form = document.querySelector('form')
const inputMessage = document.querySelector('#mensagemInput')
form.addEventListener('submit', (e) =>{
  e.preventDefault();

  const messageObj = {
    chatMessage: inputMessage.value,
    nickname: 'ok'
  };

  socket.emit('message', messageObj);
  inputMessage.value = ''
  return false;
})

// CREATE AN MESSAGE ON THE MESSAGE LIST
const createMessage = (message) => {
  const messagesUl = document.querySelector('#mensagens');
  const li = document.createElement('li');
  li.innerText = message;
  
  // data-testid="message"
  // li['data-testid'] = "online-user";
  messagesUl.appendChild(li);
}

// LISTEN EVENT ola AND CREATE A MESSAGE IF EVENT IS ACHIEVED
socket.on('welcome', (mensagem) => createMessage(mensagem));

// LISTEN EVENT mes AND CREATE A MESSAGE IF EVENT IS ACHIEVED
// IT IS NOT RECEIVED BY THE SENDER
socket.on('mensagemServer', (objeto) => createMessage(objeto.message));