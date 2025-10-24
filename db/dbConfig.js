
const dbConfig = {

    //most recent - didn't work
    // host: process.env.MYSQLHOST || process.env.DB_HOST,
    // user: process.env.MYSQLPORT  || process.env.DB_USER,
    // port: process.env.MYSQLUSER || process.env.DB_PORT,
    // password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    // database: process.env.MYSQLDATABASE || process.env.DB_NAME

    host: process.env.MYSQLHOST, 
    user: process.env.MYSQLPORT, 
    port: process.env.MYSQLUSER, 
    password: process.env.MYSQLPASSWORD, 
    database: process.env.MYSQLDATABASE 
};