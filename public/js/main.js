const numRange = Math.floor(
  Math.random() * (99999999999 - 9999999999) + 9999999999
);
const socket = io();

socket.emit("newUser", `user_${numRange}`);

document.getElementById("sendMessage").addEventListener("click", (e) => {
  const chatMessage = document.getElementById("message").value;
  const user = document.getElementById(`${socket.id}`);

  socket.emit("message", {
    chatMessage,
    nickname: user ? user.innerText : "user",
  });

  document.getElementById("message").value = "";
  document.getElementById("message").focus();
});

socket.on("message", (message) => {
  const messageLi = document.createElement("li");

  messageLi.innerHTML = message;
  messageLi.setAttribute("data-testid", "message");
  document.getElementById("chatMessages").appendChild(messageLi);
});

socket.on("updateUsers", (users) => {
  const index = users.findIndex((u) => u.socketId === socket.id);
  const filteredUSer = users.find((u) => u.socketId === socket.id);
  if (index !== -1) users.splice(index, 1);
  users.unshift(filteredUSer);

  document.getElementById("onlineUsers").innerHTML = `
  ${users.map((user) => `
    <span id=${user.socketId} class="user" data-testid="online-user">
    <svg xmlns="http://www.w3.org/2000/svg" width="3vh" height="3vh" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
    ${user.userName}</span>`).join('')}`;
});

document.getElementById("nickname-button").addEventListener("click", (e) => {
  const newUserName = document.getElementById("nickname-box").value;

  socket.emit("changeUser", newUserName);

  document.getElementById("nickname-box").value = "";
});
