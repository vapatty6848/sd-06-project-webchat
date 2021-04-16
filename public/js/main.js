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
    <li id=${user.socketId} data-testid="online-user">${user.userName}</li>`).join('')}`;
});

document.getElementById("nickname-button").addEventListener("click", (e) => {
  const newUserName = document.getElementById("nickname-box").value;

  socket.emit("changeUser", newUserName);

  document.getElementById("nickname-box").value = "";
});
