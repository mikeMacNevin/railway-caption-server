require('dotenv').config();

const pool = require('./dbConfig');

// Modern CMS links (Tech Radar's runs 270+ characters) don't fit the original
// VARCHAR(255) `url` column, and an over-long insert fails outright - so that
// site's story was silently dropped every cycle. 2048 is the practical
// ceiling browsers and servers accept for a URL.
const URL_COLUMN_LENGTH = 2048;

// Idempotent: does nothing once the column is already wide enough. Widening a
// VARCHAR that already needs a 2-byte length prefix is an in-place change in
// MySQL 8 - no table rebuild - so this is quick even on a large table.
async function ensureArticlesSchema() {
    const [[column]] = await pool.query(
        `SELECT CHARACTER_MAXIMUM_LENGTH AS len FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND COLUMN_NAME = 'url'`
    );
    if (!column) return; // no articles table yet - nothing to migrate

    if (Number(column.len) < URL_COLUMN_LENGTH) {
        await pool.query(`ALTER TABLE articles MODIFY COLUMN url VARCHAR(${URL_COLUMN_LENGTH}) NOT NULL`);
        console.log(`articles.url widened from ${column.len} to ${URL_COLUMN_LENGTH} characters`);
    }
}

module.exports = { ensureArticlesSchema };
