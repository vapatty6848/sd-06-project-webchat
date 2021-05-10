// const { Router } = require('express');
// const { createMessages, getAllMessages } = require('../models/MessagesModel');
// const { getAllUsers } = require('../models/UsersModel');

// const routerMessage = Router();
// const CREATED = 201;
// const SUCCESS = 200;

// routerMessage.post('/', async (req, res) => {
//   const { nickname, message, timestamp } = req.body;
//   const messageCreated = await createMessages(nickname, message, timestamp);
//   return res.status(CREATED).json(messageCreated);
// });

// routerMessage.get('/', async (req, res) => {
//   const allMessages = await getAllMessages();
//   return res.status(SUCCESS).json(allMessages);
// });

// routerMessage.get('/users', async (req, res) => {
//   const allUsers = await getAllUsers();
//   return res.status(SUCCESS).json(allUsers);
// });

// module.exports = routerMessage;
