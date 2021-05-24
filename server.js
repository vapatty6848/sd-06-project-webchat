// Faça seu código aqui
const moment = require('moment');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const port = 3000;

const io = require('socket.io')(httpServer);
const date = () => moment().format('DD-MM-YYYY hh:mm:ss A');
let sockets = [];

io.on('connection', (socket) => {
	socket.on('message', (data) => {
		const { nickname, chatMessage } = data;
		const message = `${date()} - ${nickname}: ${chatMessage}`;
		io.emit('message', message)
		sockets.push({ nickname, userId: socket.id });
	});
	socket.on('newNickname', (nickname) => {
		socket.nickname = nickname;
	});
	socket.on('createNickname', (nickname) => {
		sockets.push({ nickname, userId: socket.id });
		io.emit('newUserList', sockets);
	});
	socket.on('disconnect', () => {
		sockets = sockets.filter((item) => item.userId !== socket.id);
		io.emit('newUserList', sockets)
	})
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
	res.render('home', { sockets });
});

httpServer.listen(port);
