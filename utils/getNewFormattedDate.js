const getNewFormattedDate = () => {
  const date = new Date();
  const days = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const hours = date.toTimeString().replace(' GMT-0300 (Brasilia Standard Time)', '');
  return `${days} ${hours}`;
};

module.exports = getNewFormattedDate;
