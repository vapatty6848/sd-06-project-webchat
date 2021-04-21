function dateFormater(date) {
  const options = {
    timeStyle: 'medium',
    dateStyle: 'short',
  };
  const newDate = new Date(date);
  const formatedDate = new Intl.DateTimeFormat('pt-BR', options).format(newDate);

  return formatedDate.replace(/\//g, '-');
}

module.exports = dateFormater;