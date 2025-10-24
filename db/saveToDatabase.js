const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL database configuration
const dbConfig = {
  //super old
  // host: process.env.MYSQLHOST || process.env.DB_HOST,  
  // port: process.env.MYSQLPORT || process.env.port,
  // user: process.env.MYSQLUSER || process.env.DB_USER,
  // password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  // database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,

  //more recent but didn't work on railway
    // host: process.env.DB_HOST || process.env.MYSQLHOST,
    // user: process.env.DB_USER || process.env.MYSQLPORT,
    // port: process.env.DB_PORT || process.env.MYSQLUSER, 
    // password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    // database: process.env.DB_NAME ||  process.env.MYSQLDATABASE
    
    host:  process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLPORT  || process.env.DB_USER,
    port: process.env.MYSQLUSER || process.env.DB_PORT,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME
};

// Function to save article data to MySQL
module.exports = async function saveToDatabase(article) {
    if (!article) return;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = 'INSERT INTO articles (title, url, source, site_icon_url, website, page) VALUES (?, ?, ?, ?, ?, ?)';
        await connection.execute(query, [article.title, article.url, article.source, article.site_icon_url, article.website, article.page]);
        await connection.end();
        console.log(`Saved article from ${article.source}: ${article.title}`);
    } catch (error) {
        console.error(`Error saving to database for ${article.source}:`, error.message);
    }
}