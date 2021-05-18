const {
  insertMSG,
  getMSG,
} = require('../models/messageModels');

const formatMsg = (date, name, msg) => {
  const formatedMessage = `${date} ${name} Diz: ${msg}`;
  return formatedMessage;
};

const getMessage = async (_req, res) => {
  const histMSG = await getMSG();
  res.status(200).render('chat/index', { histMSG });
};

const insertMessage = async (date, name, msg) => {
  console.log(msg, 'de', name, 'data', date);
  await insertMSG({ infoMassage: { date, name, msg } });
};

module.exports = {
  insertMessage,
  getMessage,
  formatMsg,
};