const mysql = require('mysql');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

// // Prisijunkite prie MySQL duomenų bazės
connection.connect((err) => {
  if (err) {
    console.error('Klaida jungiantis prie MySQL:', err);
    return;
  }
  console.log('Prisijungta prie MySQL duomenų bazės');
});

module.exports = {
    connection: connection
}