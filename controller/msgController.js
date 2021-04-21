const { Router } = require('express');

 const createMsg = require('../models/message');
//  const { checkUser } = require('../midddleware/userMiddleware');

const msgController = new Router();

msgController.post('/', async (req, res) => {
  const okay = 201;
  const msg = req.body;
  console.log(msg);
  const { ops } = await createMsg(msg);
  // console.log(atual);
  res.status(okay).json(ops);
});

module.exports = msgController;