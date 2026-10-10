const pool = require('./dbConfig');

// One row per (platform, briefing date) that has been shared, so the daily
// social post goes out exactly once no matter how often the worker restarts
// or the scheduled job retries. A row is claimed *before* posting and only
// released again if the post fails - see claimPost/releasePost.
async function ensureSocialPostsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS social_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      platform VARCHAR(32) NOT NULL,
      summary_date DATE NOT NULL,
      post_uri VARCHAR(512) NULL,
      posted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_platform_date (platform, summary_date)
    )
  `);
}

// Returns true if this call won the right to post. The unique key makes this
// safe even if two runs overlap - only one INSERT can succeed.
async function claimPost(platform, date) {
  const [result] = await pool.execute(
    'INSERT IGNORE INTO social_posts (platform, summary_date) VALUES (?, ?)',
    [platform, date]
  );
  return result.affectedRows === 1;
}

async function recordPostUri(platform, date, uri) {
  await pool.execute(
    'UPDATE social_posts SET post_uri = ? WHERE platform = ? AND summary_date = ?',
    [uri, platform, date]
  );
}

// Lets the next scheduled attempt try again after a failed post.
async function releasePost(platform, date) {
  await pool.execute(
    'DELETE FROM social_posts WHERE platform = ? AND summary_date = ? AND post_uri IS NULL',
    [platform, date]
  );
}

module.exports = { ensureSocialPostsTable, claimPost, recordPostUri, releasePost };
