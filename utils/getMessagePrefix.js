const getDate = () => {
  const locale = 'pt-br';
  const options = {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: true,
  };

  const date = new Date().toLocaleString(locale, options).replace(/\//g, '-');

  return date;
};

const getPrefix = (nickname) => {
  const date = getDate();
  const prefix = `${date} - ${nickname}: `;
  return prefix;
};

module.exports = getPrefix;
