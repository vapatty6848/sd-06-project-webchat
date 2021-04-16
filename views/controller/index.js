/* const socket = io('http://localhost:3000');

    const sendMessage = document.querySelector('#button-message');
    const saveNickname = document.querySelector('#button-nickname');
    const inputMessage = document.querySelector('#message-input');
    const inputNickname = document.querySelector('#nickname-input');
    const messageUl = document.querySelector('#message-list');

    const addZero = (number) => ((number <= 9) ? `0${number}` : number);

    saveNickname.addEventListener('click', (e) => {
      e.preventDefault();
      const userNickname = inputNickname.value;
      localStorage.setItem('currentUser', userNickname);
      inputNickname.value = '';
    });

    sendMessage.addEventListener('click', (e) => {
      e.preventDefault();
      const chatMessage = inputMessage.value;
      const nickname = localStorage.getItem('currentUser');
      const messageDate = new Date();
      const formattedDate = `${addZero(messageDate.getDate().toString())}-${addZero((messageDate.getMonth() + 1).toString())}-${messageDate.getFullYear()} ${addZero(messageDate.getHours())}:${addZero(messageDate.getMinutes())}:${addZero(messageDate.getSeconds())}`;
      // console.log('nickname localstorage', nickname);
      // console.log(formattedDate);
      socket.emit('message', { chatMessage, nickname, formattedDate });
      inputMessage.value = '';
    });

    const createMessage = (message) => {
      const li = document.createElement('li');
      li.innerText = `${message.formattedDate} ${message.nickname}: ${message.chatMessage}`;
      messageUl.appendChild(li);
    };
    socket.on('message', (objUser) => createMessage(objUser)); */