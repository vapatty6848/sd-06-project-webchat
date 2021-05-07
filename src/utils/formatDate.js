module.exports = () => {
  const date = Date.now();
  const options = { dateStyle: 'short', timeStyle: 'medium', hour12: true };
  const dateFormated = new Intl.DateTimeFormat('pt-br', options).format(date).replace(/\//g, '-');
  return dateFormated;
};
