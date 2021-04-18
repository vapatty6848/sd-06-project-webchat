module.exports = (date) => {
  const d = date.getDay();
  const mo = date.getMonth();
  const y = date.getFullYear();
  const h = date.getHours();
  const mi = date.getMinutes();
  const s = date.getSeconds();

  return `${d}-${mo}-${y} ${h}:${mi}:${s}`;
};
