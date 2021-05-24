// Faça seu código aqui
const moment = require('moment');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const port = 3000;

const io = require('socket.io')(httpServer);
const date = () => moment().format('DD-MM-YYYY hh:mm:ss A');

io.on('connection', (socket) => {
	console.log(socket.id)

	socket.on('message', (data) => {
		const { nickname, chatMessage } = data;
		
		const message = `${date()} - ${nickname}: ${chatMessage}`;
		io.emit('message', message)
	})
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_req, res) => {
	res.render('home');
});

httpServer.listen(port);
