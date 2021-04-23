const generateRandomNick = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomNick = '';
  for (let i = 0; i < 16; i += 1) {
      randomNick += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomNick;
};

module.exports = generateRandomNick;  