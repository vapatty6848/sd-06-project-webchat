const { Router } = require('express');
const { historicModel } = require('../models');
const { ChatUtils } = require('../utils');

const route = Router();

route.post('/', async (req, res) => {
 console.log(req.body.message);
});

route.get('/', async (_req, res) => {
  const Nickname = await ChatUtils.createNickname();
  const historic = await historicModel.findAll();
  return res.render('home', { Nickname, historic });
});

module.exports = route;
