const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "cafeuser",
    password: "cafe1234",
    database: "cafe_db",
    waitForConnections: true,
    connectionLimit: 5
});

module.exports = pool;
