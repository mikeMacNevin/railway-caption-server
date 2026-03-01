const express = require('express');
const mysql = require('mysql2/promise'); 
const router = express.Router();

require('dotenv').config();
//CORS

const dbConfig = require('../db/dbConfig')


// const dbConfig = {
//   host: process.env.MYSQLHOST || process.env.DB_HOST,  
//   port: process.env.MYSQLPORT || process.env.DB_PORT,
//   user: process.env.MYSQLUSER || process.env.DB_USER,
//   password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
//   database: process.env.MYSQLDATABASE || process.env.DB_NAME

// // };

// }

router.get('/articles/:page', async (req, res) => {
  console.log("attempt")
  const pageValue = [req.params.page]

  console.log(`page value: ${pageValue[0]}`);

    let connection;
    try {
      // Create a connection to the MySQL database
      connection = await mysql.createConnection(dbConfig);
  
      // Query to get the latest article from each source
      const query = `
SELECT 
    title,
    url,
    source,
    created_at,
    page,
    site_icon_url,
    website
FROM (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY source ORDER BY created_at DESC) AS rn_per_source
    FROM (
        SELECT 
            *,
            ROW_NUMBER() OVER (PARTITION BY source, title ORDER BY created_at DESC) AS dedup_rn
        FROM articles
        WHERE page = ?
          AND created_at > NOW() - INTERVAL 48 HOUR
    ) deduped
    WHERE dedup_rn = 1
) final
WHERE rn_per_source <= 6
ORDER BY created_at DESC;
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
    }
  );

module.exports = router;

