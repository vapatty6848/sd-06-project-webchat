  // const socket = io();
  // const randomNickname = `user_${Math.random().toString().substr(2, 11)}`;
  // const userButton = document.querySelector('#userButton');
  // const messageButton = document.querySelector('#messageButton');
  // const userInput = document.querySelector('#userInput');
  // const messageInput = document.querySelector('#messageInput');
  // let currentUser;
  // let lastUser;

  // userButton.addEventListener('click', () => {
  //   currentUser.nickname = userInput.value;
  //   socket.emit('userUpdate', currentUser);
  //   return false;
  // });

  // messageButton.addEventListener('click', () => {
  //   const { nickname } = currentUser;
  //   socket.emit('message', ({
  //     nickname,
  //     chatMessage: messageInput.value,
  //   }));
  //   messageInput.value = '';
  //   return false;
  // });

  // const createMessage = (message) => {
  //   const messagesUl = document.querySelector('#messages');
  //   const li = document.createElement('li');
  //   li.innerText = message;
  //   li.setAttribute('data-testid', 'message')
  //   messagesUl.appendChild(li);
  // };

  // const createUser = (user) => {
  //     const usersUl = document.querySelector('#users');
  //     const li = document.createElement('li');
  //     li.innerText = user.nickname;
  //     lastUser = user.nickname;
  //     li.setAttribute('id', `${user.nickname}`);
  //     li.setAttribute('data-testid', 'online-user');
  //     usersUl.appendChild(li);
  //   }

  // const listUsers = (users) => {
  //   // const userUl = document.querySelector(`#users`);
  //   console.log(last)
  //   const userUl = document.querySelector(`#${lastUser}`);
  //   console.log(userUl)
  //   userUl.innerHTML= currentUser;

  //   // createUser(currentUser)
  //   // users.filter(user => user.id !== currentUser.id)
  //   //   .forEach(user => createUser(user));
  // };

  // socket.on('connect', () => {
  //   const nickname = randomNickname;
  //   currentUser = { nickname }
  //   socket.emit('user', nickname);
  // });
  
  // socket.on('users', (user) => {
  //   console.log(user)
  //   currentUser = user[0].nickname;
  //   console.log(currentUser);
  //   listUsers(user);
  // })

  // window.onload = async () => {
  //   const messages = await fetch('http://localhost:3000/messages', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //   }).then((res) => res.json());
  //   const messagesUl = document.querySelector('#messages');
  //   messages.forEach((message) => {
  //     const li = document.createElement('li');
  //     li.setAttribute('data-testid', 'message');
  //     li.innerText = `${message.date} ${message.nickname} ${message.message}`;
  //     messagesUl.appendChild(li);
  //   });
  // };

  // socket.on('message', (message) => createMessage(message));
