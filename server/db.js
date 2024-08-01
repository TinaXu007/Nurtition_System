const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "1991210",
    host: "localhost",
    port: 5432,
    database: "user"
});

module.exports = pool;