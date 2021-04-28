const Randomstring = require('randomstring');

function generateNickname() {
  return Randomstring.generate({ length: 6, charset: 'alphabetic' });
}

module.exports = generateNickname;