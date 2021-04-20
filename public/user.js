const nicknameButton = document.querySelector('#nicknameButton');

nicknameButton.addEventListener('click', () => {
  const nicknameInput = document.querySelector('#nicknameInput');
  console.log(nicknameInput.value);
  window.window.globalVariables.NICKNAME = nicknameInput.value;
  nicknameInput.value = '';
});