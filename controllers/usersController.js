const { Router } = require('express');

const router = Router();
const usersModel = require('../models/usersModel');

router.get('/', async (req, res) => {
  const [users] = await usersModel.getAll();
  // console.log(users);
  
  res.status(200).json(users);
});

module.exports = router;
