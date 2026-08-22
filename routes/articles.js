const express = require('express');
const crypto = require('crypto');
const router = express.Router();

require('dotenv').config();

const pool = require('../db/dbConfig');

// Gates /debug behind a shared secret (?key=...). Fails closed: if
// DEBUG_KEY isn't set at all, the route is disabled outright rather than
// left open. Returns a plain 404 either way so an unauthorized request
// can't tell "wrong key" apart from "route doesn't exist".
function requireDebugKey(req, res, next) {
  const configured = process.env.DEBUG_KEY;
  const supplied = req.query.key;

  if (!configured || !supplied) {
    return res.status(404).end();
  }

  const a = Buffer.from(String(supplied));
  const b = Buffer.from(configured);
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!match) {
    return res.status(404).end();
  }

  next();
}

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
            ROW_NUMBER() OVER (PARTITION BY source, url ORDER BY created_at DESC) AS dedup_rn
        FROM articles
        WHERE page = ?
          AND created_at > NOW() - INTERVAL 48 HOUR
    ) deduped
    WHERE dedup_rn = 1
) final
WHERE rn_per_source <= 6
ORDER BY created_at DESC;
`;

const ALL_PAGES = ['home', 'politics', 'finance', 'world', 'sports', 'tech', 'celebs', 'movies', 'tv', 'videogames', 'travel', 'health', 'science'];

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

router.get('/debug', requireDebugKey, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as total, MAX(created_at) as latest FROM articles');
    const [pages] = await pool.execute('SELECT page, COUNT(*) as count FROM articles GROUP BY page');
    const [homeRaw] = await pool.execute('SELECT COUNT(*) as count, MAX(created_at) as latest FROM articles WHERE page = ?', ['home']);
    const [home48h] = await pool.execute('SELECT COUNT(*) as count FROM articles WHERE page = ? AND created_at > NOW() - INTERVAL 48 HOUR', ['home']);
    const [[{ db_now }]] = await pool.execute('SELECT NOW() as db_now');
    res.json({ connection: 'ok', stats: rows[0], pages, homeRaw: homeRaw[0], home48h: home48h[0], db_now });
  } catch (err) {
    res.status(500).json({ connection: 'failed', error: err.message });
  }
});

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
