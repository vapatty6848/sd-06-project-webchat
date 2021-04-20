const generateRandomName = (length) => {
  let name = '';
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 1; index <= length; index += 1) {
    name += charset[Math.floor(Math.random() * charset.length)];
  }
  return name;
};

let NICKNAME = '';
NICKNAME = generateRandomName(16);

window.globalVariables = { NICKNAME };
