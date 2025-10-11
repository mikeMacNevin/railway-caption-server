const express = require('express');
const mysql = require('mysql2/promise'); 
const router = express.Router();

require('dotenv').config();

//CORS



const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,  
  port: process.env.MYSQLPORT || process.env.port,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
};



router.get('/articles/:page', async (req, res) => {
  const pageValue = [req.params.page]



  console.log(`page value: ${pageValue[0]}`);

    let connection;
    try {
      // Create a connection to the MySQL database
      connection = await mysql.createConnection(dbConfig);

  
      // Query to get the latest article from each source
      const query = `
        SELECT a.title, a.url, a.source, a.created_at, a.page, a.site_icon_url, a.website
        FROM articles a
        INNER JOIN (
          SELECT source, MAX(created_at) as max_created_at
          FROM articles
          WHERE page = ?
          GROUP BY source
        ) latest ON a.source = latest.source AND a.created_at = latest.max_created_at
        ORDER BY a.source;
      `;
      // Execute the query
      const [rows] = await connection.execute(query, pageValue);
      // Check if we have results
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No articles found' });
      }
      // Send the results as JSON
      res.status(200).json({
        message: 'Latest articles retrieved successfully',
        articles: rows
      });

    } catch (error) {
      console.error('Error fetching latest articles:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // Close the database connection
      if (connection) {
        await connection.end();
      }

    }
});


module.exports = router;

