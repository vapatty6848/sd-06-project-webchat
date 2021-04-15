module.exports = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  var charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters[Math.floor(Math.random() * charactersLength)];
  }
  return result
}
