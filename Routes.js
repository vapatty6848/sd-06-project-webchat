const { Router } = require('express');
const controller = require('./controllers');

const Routes = Router();

Routes.use('/', controller.messageController);

module.exports = Routes;
