const { model } = require('mongoose');
const messageSchema = require('../schemas/messageSchema');

const Message = model('Message', messageSchema);

const getAll = () => {
  const result = Message.find((err, messages) => {
    if (err) console.log(err);
    return messages;
  });

  return result;
};

const create = (message, nickname, timestamps) => {
  const insertion = new Message({
    message,
    nickname,
    timestamps,
  });

  insertion.save()
    .then((result) => {
    console.log(result);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getAll,
  create,
};
