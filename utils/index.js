// lógica time retirada do PR - https://github.com/tryber/sd-06-project-webchat/blob/RenatoCostaDev-webchat-project/server.js

const time = new Date();
const date = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
  .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

const randomNickName = () => {
  const length = 16;
  const characteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += characteres.charAt(Math.floor(Math.random() * characteres.length));
  }
  return result;
};

module.exports = {
  date,
  randomNickName,
};