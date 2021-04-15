// const { Router } = require('express');

// const webChat = Router();

// const currentDateFormat = require('./utils/currentDateFormat')

// webChat.get('/', (_req, res) => {
//   res.render(__dirname + '/view/chat.ejs');
// });

// io.on('connection', (socket) => {
//   console.log('Conectado');

//   socket.on('disconnect', () => {
//     console.log('Desconectado');
//   });

//   socket.on('message', (msg) => {
//     console.log(`Mensagem ${msg}`);
//     const { nickname, chatMessage } = msg;
    
//     io.emit('messageCli', `${currentDateFormat()} - ${nickname}: ${chatMessage}`);
//   });
// });

// module.exports = webChat;