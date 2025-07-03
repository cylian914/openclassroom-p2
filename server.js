require("dotenv").config();
const http = require('http');
const app = require('./app');
const { exit } = require('process');

app.set('port', 4000);
global.baseDir = __dirname;

if (process.env.DBaccess === "" || process.env.TokenKey === "") {
    throw new Error("Env variable not set")
}
console.log(process.env.DBAccess)
const server = http.createServer(app);

server.listen(4000);