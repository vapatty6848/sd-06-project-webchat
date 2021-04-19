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

module.exports = getDate;
