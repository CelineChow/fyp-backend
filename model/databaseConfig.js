const mysql = require('mysql');

const pool = mysql.createPool({
    //Change to your own one    
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "ninemars_db",
    multipleStatements: true,
    timezone: 'utc'
});

module.exports = pool;
