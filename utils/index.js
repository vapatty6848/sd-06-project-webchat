function addZero(i) {
  let newInt;
  if (i < 10) {
    newInt = `0${i}`;
  } else {
    newInt = i;
  }
  return newInt;
}

function setTimestamp() {
  const date = new Date();
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  const h = addZero(date.getHours());
  const min = addZero(date.getMinutes());
  const s = addZero(date.getSeconds());
  return `${d}-${m}-${y} ${h}:${min}:${s}`;
}

module.exports = {
  setTimestamp,
};
