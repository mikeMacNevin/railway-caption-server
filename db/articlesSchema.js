require('dotenv').config();

const pool = require('./dbConfig');

// Modern CMS links (Tech Radar's runs 270+ characters) don't fit the original
// VARCHAR(255) `url` column, and an over-long insert fails outright - so that
// site's story was silently dropped every cycle. 2048 is the practical
// ceiling browsers and servers accept for a URL.
const URL_COLUMN_LENGTH = 2048;

// Another process (the API server or the worker - both run this on boot) can
// win the race to add the same column or index. That's success, not failure.
const ALREADY_DONE = new Set(['ER_DUP_FIELDNAME', 'ER_DUP_KEYNAME']);

async function alterIgnoringRace(sql) {
    try {
        await pool.query(sql);
    } catch (err) {
        if (!ALREADY_DONE.has(err.code)) throw err;
    }
}

async function columnInfo(name) {
    const [[column]] = await pool.query(
        `SELECT CHARACTER_MAXIMUM_LENGTH AS len, IS_NULLABLE AS nullable FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND COLUMN_NAME = ?`,
        [name]
    );
    return column;
}

// Idempotent: each step checks first and does nothing once applied. Every
// change here is quick even on a full table - widening a VARCHAR that already
// needs a 2-byte length prefix is in-place in MySQL 8, and the table only
// holds 7 days of headlines (see pruneOldArticles.js).
async function ensureArticlesSchema() {
    const url = await columnInfo('url');
    if (!url) return; // no articles table yet - nothing to migrate

    if (Number(url.len) < URL_COLUMN_LENGTH) {
        await pool.query(`ALTER TABLE articles MODIFY COLUMN url VARCHAR(${URL_COLUMN_LENGTH}) NOT NULL`);
        console.log(`articles.url widened from ${url.len} to ${URL_COLUMN_LENGTH} characters`);
    }

    // A headline that's still a site's top story gets its row's last_seen_at
    // bumped instead of a new row (see saveToDatabase.js), so created_at means
    // "first seen". Added nullable, backfilled from created_at (the right
    // value for every row written before this), then made NOT NULL with a
    // default so inserts from a not-yet-redeployed worker still get a value.
    let lastSeen = await columnInfo('last_seen_at');
    if (!lastSeen) {
        await alterIgnoringRace('ALTER TABLE articles ADD COLUMN last_seen_at TIMESTAMP NULL');
        console.log('articles.last_seen_at added');
        lastSeen = await columnInfo('last_seen_at');
    }
    if (lastSeen.nullable === 'YES') {
        await pool.query('UPDATE articles SET last_seen_at = created_at WHERE last_seen_at IS NULL');
        await pool.query('ALTER TABLE articles MODIFY COLUMN last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
    }

    // Every save now looks up the site's existing rows first.
    const [[{ present }]] = await pool.query(
        `SELECT COUNT(*) AS present FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND INDEX_NAME = 'idx_articles_page_source'`
    );
    if (!present) {
        await alterIgnoringRace('ALTER TABLE articles ADD INDEX idx_articles_page_source (page, source)');
    }
}

module.exports = { ensureArticlesSchema };
