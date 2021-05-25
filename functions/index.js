const formatDate = () => {
    const date = new Date();
    const day = date.getDate().toString();
    const dayFormated = (day.length === 1) ? `0${day}` : day;
    const month = (date.getMonth() + 1).toString();
    const monthFormated = (month.length === 1) ? `0${month}` : month;
    const yearFormated = date.getFullYear();
    const hour = date.toLocaleTimeString();
    return `${dayFormated}-${monthFormated}-${yearFormated} ${hour}`;
  };
  
  module.exports = {
    formatDate,
  };
