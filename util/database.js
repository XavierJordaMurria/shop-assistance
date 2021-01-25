const mysql = require('mysql2');

const pool = mysql.createConnection({
    user:'user',
    host: 'localhost',
    database: 'db_name',
    password: 'pass'
});

module.exports = pool.promise();