const { format } = require('date-fns');

function formatDate(date) {
  const formattedDate = format(date, 'dd\'-\'MM\'-\'yyyy HH\':\'mm\':\'ss a');

  return formattedDate;
}

module.exports = {
  formatDate,
};
