require('dotenv').config();

const pool = require('./dbConfig');

const RETENTION_DAYS = 7;
const BATCH_SIZE = 5000;

// Nothing ever deletes a row today - the 48-hour window in routes/articles.js
// only filters what queries *return*, not what's stored, so the table (and
// every index/query against it) only ever grows. This reclaims that space.
//
// Deletes in batches instead of one giant statement so a large backlog
// (e.g. the first run after this ships) doesn't hold a long lock on the
// table while visitors are being served from it.
module.exports = async function pruneOldArticles() {
  let totalDeleted = 0;

  while (true) {
    // pool.query (client-side placeholder substitution), not pool.execute
    // (server-side prepared statements) - mysql2's prepared-statement
    // protocol rejects a parameter marker in LIMIT.
    const [result] = await pool.query(
      'DELETE FROM articles WHERE created_at < NOW() - INTERVAL ? DAY LIMIT ?',
      [RETENTION_DAYS, BATCH_SIZE]
    );
    totalDeleted += result.affectedRows;
    if (result.affectedRows < BATCH_SIZE) break;
  }

  return totalDeleted;
};
