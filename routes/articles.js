const express = require('express');
const router = express.Router();

require('dotenv').config();

const pool = require('../db/dbConfig');

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const cache = {}; // { [page]: { data: [], fetchedAt: timestamp } }

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

const ALL_PAGES = ['home', 'politics', 'finance', 'world', 'sports', 'tech', 'celebrities', 'movies', 'tv', 'games', 'travel', 'health', 'science'];

async function warmCache() {
  console.log('Pre-warming article cache...');
  for (const page of ALL_PAGES) {
    try {
      const [rows] = await pool.execute(query, [page]);
      cache[page] = { data: rows, fetchedAt: Date.now() };
      console.log(`  cached: ${page} (${rows.length} articles)`);
    } catch (err) {
      console.error(`  failed to cache: ${page}`, err.message);
    }
  }
  console.log('Cache pre-warm complete.');
}

router.get('/articles/:page', async (req, res) => {
  const page = req.params.page;

  const cached = cache[page];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return res.status(200).json({ message: 'Latest articles retrieved successfully', articles: cached.data });
  }

  try {
    const [rows] = await pool.execute(query, [page]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No articles found' });
    }

    cache[page] = { data: rows, fetchedAt: Date.now() };

    res.status(200).json({ message: 'Latest articles retrieved successfully', articles: rows });
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = { router, warmCache };
