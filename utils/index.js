// lógica time retirada do PR - https://github.com/tryber/sd-06-project-webchat/blob/RenatoCostaDev-webchat-project/server.js

const time = new Date();
const date = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${time
  .getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

module.exports = {
  date,
};