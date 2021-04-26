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

// '2021-04-01 12:00:00'

const convertDate = (dateToConvert) => {
  const [date, hour, timeFormat] = dateToConvert.split(' ');
  const newDate = date.split('-').reverse().join('-');
  const [hours, minutes, seconds] = hour.split(':');
  const newHour = timeFormat === 'PM' && Number(hours) + 12;
  const newTimeStamp = `${newHour || hours}:${minutes}:${seconds}`;
  const convertedDate = `${newDate} ${newTimeStamp}`;
  return convertedDate;
};

const getPrefixes = (nickname) => {
  const date = getDate();
  const messagePrefix = `${date} - ${nickname}: `;

  const convertedDate = convertDate(date);

  return { messagePrefix, convertedDate };
};

module.exports = getPrefixes;
