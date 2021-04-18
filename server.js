const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(httpServer);

app.set('view engine', 'ejs');
app.set('views', './view');

app.get('/', (_req, res) => {
  res.render('home');
});

httpServer.listen(PORT, () => console.log(`on PORT ${PORT}`));
