
const dbConfig = {
  // host: process.env.MYSQLHOST || process.env.DB_HOST,  
  // port: process.env.MYSQLPORT || process.env.DB_PORT,
  // user: process.env.MYSQLUSER || process.env.DB_USER,
  // password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  // database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
    host:  process.env.DB_HOST, 
      port:  process.env.DB_PORT,
 
      user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};