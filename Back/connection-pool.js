const mysql = require('mysql');
// Initialize pool
const pool      =    mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "magi",
    debug    :  false,
});    
module.exports = pool;