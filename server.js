const http = require('http');
const app = require('./app');

app.set('port', 4000);
global.baseDir = __dirname;

const server = http.createServer(app);

server.listen(4000);