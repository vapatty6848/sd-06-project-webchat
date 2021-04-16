const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');

const randomUserNickname = () => {
  let nickname = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: '',
    style: 'capital',
  });
  while (nickname.length !== 16) {
    nickname = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      length: 2,
      separator: '',
      style: 'capital',
    });
  }
  return nickname;
};

module.exports = randomUserNickname;
