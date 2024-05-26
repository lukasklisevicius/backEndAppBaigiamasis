const mysql = require('mysql');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_SOCKET_PATH } = require('./config');

const connectionObject = {
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
}

if (DB_HOST) {
  connectionObject.host = DB_HOST;
  connectionObject.port = 3306;
}

if (DB_SOCKET_PATH) {
  connectionObject.socketPath = DB_SOCKET_PATH;
}

console.log(connectionObject)
const connectionPool = mysql.createPool(connectionObject);


module.exports = {
    connectionPool: connectionPool
}