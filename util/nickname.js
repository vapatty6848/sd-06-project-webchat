const alphabet = ['a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
  'q', 'r', 's', 't', 'u', 'v', 'x', 'w', 'y', 'z',
];

const makeNickname = () => {
  let first = '';
  for (let i = 1; i <= 6; i += 1) {
    first += `${alphabet[Math.floor(Math.random() * 26)]}`;
  }
  // const nick = `${alphabet[Math.floor(Math.random() * 26)]}${alphabet[Math.floor(Math.random() * 26)]}`;
  return `${first}_do_${first}`;
};

module.exports = makeNickname;
