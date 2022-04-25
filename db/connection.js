const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'Deadrat55-',
        database: 'business'
    },
    console.log('Connected to the business database.')
);

module.exports = connection;