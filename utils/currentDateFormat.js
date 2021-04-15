module.exports = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const hour = today.getHours();
  const minute = today.getMinutes();
  const second = today.getSeconds();
  const AmPm = hour >= 12 ? 'PM' : 'AM';
  let hourAmPm = hour % 12;
  if (!hourAmPm) hourAmPm = 12;

  function add0(decimal) {
    return `${decimal}`.length === 1 ? `0${decimal}` : decimal;
  }

  return `${add0(day)}-${add0(month)}-${year} `
    + `${add0(hourAmPm)}:${add0(minute)}:${add0(second)} ${AmPm}`;
};
