function generateDate() {
  const options = {
    timeStyle: 'medium',
    dateStyle: 'short',
  };
  const date = Date.now();
  const formatedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);

  return formatedDate;
}

module.exports = generateDate;
