const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charList = chars.split('');
const charListLength = charList.length;

function sortCharIndex() {
  return Math.round(Math.random() * (charListLength - 1));
}

module.exports = function generateNickname(nicknameSize) {
  const nicknameAggregator = [];
  for (let i = 1; i <= nicknameSize; i += 1) {
    const index = sortCharIndex();
    const char = charList[index];
    nicknameAggregator.push(char);
  }
  const nickname = nicknameAggregator.join('');
  return nickname;
};
