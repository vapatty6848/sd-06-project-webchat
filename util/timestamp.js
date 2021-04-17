function generateDate() {
  const options = {
    timeStyle: 'medium',
    dateStyle: 'short',
  };
  const date = Date.now();
  const formatedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);

  const restring = formatedDate.split(' ');
  const recivestring = restring[0];
  const reversestring = recivestring.split('-');
  const finalstring = `${reversestring[2]}-${reversestring[1]}-${reversestring[0]}`;
  restring[0] = finalstring;
  const finalresponse = restring.join(' ');

  return finalresponse.replace(/\//g, '-');
}

module.exports = generateDate;
