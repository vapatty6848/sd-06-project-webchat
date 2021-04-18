const express = require('express');

const chatController = require('./chatController');

const router = express.Router();

router.get('/', chatController.getMessages);

module.exports = router;
