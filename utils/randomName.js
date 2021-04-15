module.exports = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i += 1) {
    result += characters[Math.floor(Math.random() * charactersLength)];
  }
  return result;
};
