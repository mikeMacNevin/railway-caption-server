const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const router = express.Router();

require('dotenv').config();

const pool = require('../db/dbConfig');

// Applies to every route on this router. Generous enough that no real
// visitor ever notices - a page load only fires a handful of category
// requests - but caps scripted floods that would otherwise compete with
// real traffic for the event loop and, on a cache miss, the DB pool.
// Relies on `app.set('trust proxy', 1)` in server.js to see the visitor's
// real IP instead of Railway's proxy.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please slow down.' },
});
router.use(apiLimiter);

// A tighter limit specifically on /debug, on top of the key gate below -
// throttles key-guessing attempts hard even before they get a chance to
// fail the timing-safe comparison.
const debugLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

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

router.get('/debug', debugLimiter, requireDebugKey, async (req, res) => {
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

const SEARCH_MIN_LENGTH = 2;
const SEARCH_RESULT_LIMIT = 50;

// Not bound to the 48-hour "freshness" window the category feeds use, or
// their 6-per-source cap - those exist to keep a front page current and
// balanced across sources, neither of which applies to someone looking
// for a specific thing they already saw. Bound instead by whatever the
// retention job (db/pruneOldArticles.js) still has on hand: up to 7 days.
const searchQuery = `
SELECT title, url, source, created_at, page, site_icon_url, website
FROM articles
WHERE title LIKE ? ESCAPE '\\\\'
ORDER BY created_at DESC
LIMIT ${SEARCH_RESULT_LIMIT}
`;

// Escapes a user-supplied search term's own literal % and _ characters so
// they can't be used as SQL LIKE wildcards - e.g. searching "50% off"
// should match that text, not "any-character off" preceded by anything.
function escapeLikeTerm(term) {
  return term.replace(/[\\%_]/g, (char) => `\\${char}`);
}

router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim();

  if (q.length < SEARCH_MIN_LENGTH) {
    return res.status(200).json({ articles: [] });
  }

  try {
    const pattern = `%${escapeLikeTerm(q)}%`;
    const [rows] = await pool.execute(searchQuery, [pattern]);
    res.status(200).json({ articles: rows });
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ message: 'Internal server error' });
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
