const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL database configuration
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,  
  port: process.env.MYSQLPORT || process.env.DB_PORT,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
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