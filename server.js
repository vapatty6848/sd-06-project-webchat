const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const cors = require('cors');
const chat = require('./chat');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.use(cors());

chat(http);

http.listen(3000, () => console.log('Running on port 3000'));
