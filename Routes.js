const { Router } = require('express');
const controller = require('./controllers');

const Routes = Router();

Routes.use('/testando', controller.messageController);

module.exports = Routes;
