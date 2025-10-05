const express = require('express');
const mysql = require('mysql2/promise'); // Using mysql2 with promise support
const router = express.Router();

require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};



router.get('/latest-articles', async (req, res) => {

  let connection;
  try {
    // Create a connection to the MySQL database
    connection = await mysql.createConnection(dbConfig);

    // Query to get the latest article from each source
    const query = `
      SELECT a.title, a.url, a.source, a.created_at
      FROM articles a
      INNER JOIN (
        SELECT source, MAX(created_at) as max_created_at
        FROM articles
        WHERE page = 'home'
        GROUP BY source
      ) latest ON a.source = latest.source AND a.created_at = latest.max_created_at
      ORDER BY a.source;
    `;

      //     SELECT a.title, a.url, a.source, a.created_at
      // FROM articles a
      // INNER JOIN (
      //   SELECT source, MAX(created_at) as max_created_at
      //   FROM articles
      //   GROUP BY source
      // ) latest ON a.source = latest.source AND a.created_at = latest.max_created_at
      // ORDER BY a.source;

    // Execute the query
    const [rows] = await connection.execute(query);

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

router.get('/latest-articles/politics', async (req, res) => {

  let connection;
  try {
    // Create a connection to the MySQL database
    connection = await mysql.createConnection(dbConfig);

    // Query to get the latest article from each source
    const query = `
      SELECT a.title, a.url, a.source, a.created_at
      FROM articles a
      INNER JOIN (
        SELECT source, MAX(created_at) as max_created_at
        FROM articles
        WHERE page = 'politics'
        GROUP BY source
      ) latest ON a.source = latest.source AND a.created_at = latest.max_created_at
      ORDER BY a.source;
    `;

      //     SELECT a.title, a.url, a.source, a.created_at
      // FROM articles a
      // INNER JOIN (
      //   SELECT source, MAX(created_at) as max_created_at
      //   FROM articles
      //   GROUP BY source
      // ) latest ON a.source = latest.source AND a.created_at = latest.max_created_at
      // ORDER BY a.source;

    // Execute the query
    const [rows] = await connection.execute(query);

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

router.get('/latest-articles/finance', async (req, res) => {

  let connection;
  try {
    // Create a connection to the MySQL database
    connection = await mysql.createConnection(dbConfig);

    // Query to get the latest article from each source
    const query = `
      SELECT a.title, a.url, a.source, a.created_at
      FROM articles a
      INNER JOIN (
        SELECT source, MAX(created_at) as max_created_at
        FROM articles
        WHERE page = 'finance'
        GROUP BY source
      ) latest ON a.source = latest.source AND a.created_at = latest.max_created_at
      ORDER BY a.source;
    `;

      //     SELECT a.title, a.url, a.source, a.created_at
      // FROM articles a
      // INNER JOIN (
      //   SELECT source, MAX(created_at) as max_created_at
      //   FROM articles
      //   GROUP BY source
      // ) latest ON a.source = latest.source AND a.created_at = latest.max_created_at
      // ORDER BY a.source;

    // Execute the query
    const [rows] = await connection.execute(query);

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

