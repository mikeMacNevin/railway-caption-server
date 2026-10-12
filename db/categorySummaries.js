const pool = require('./dbConfig');
const { briefingDate } = require('./summaries');

// The daily overview shown above each category page's headlines (see
// summary/categorySummary.js). Like `summaries`, nothing prunes this table -
// a dozen small rows a day is negligible.
async function ensureCategorySummariesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS category_summaries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      page VARCHAR(32) NOT NULL,
      summary_date DATE NOT NULL,
      generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      headline VARCHAR(255) NOT NULL,
      overview TEXT NOT NULL,
      paragraphs JSON NOT NULL,
      model VARCHAR(64) NOT NULL,
      article_count INT NOT NULL,
      INDEX idx_category_page_date (page, summary_date, generated_at)
    )
  `);
}

async function saveCategorySummary(page, { headline, dek, paragraphs, model, articleCount }) {
  const [result] = await pool.execute(
    'INSERT INTO category_summaries (page, summary_date, headline, overview, paragraphs, model, article_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [page, briefingDate(), headline, dek, JSON.stringify(paragraphs), model, articleCount]
  );
  return result.insertId;
}

// Pages that already have today's overview, so a retry only fills the gaps.
async function pagesDoneToday() {
  const [rows] = await pool.execute(
    'SELECT DISTINCT page FROM category_summaries WHERE summary_date = ?',
    [briefingDate()]
  );
  return new Set(rows.map((row) => row.page));
}

// The newest overview for a page, but only if it's recent - a stale one
// sitting above today's headlines would be worse than none.
const MAX_AGE_HOURS = 36;

async function getLatestCategorySummary(page) {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(summary_date, '%Y-%m-%d') AS summary_date, generated_at, headline, overview, paragraphs
     FROM category_summaries
     WHERE page = ? AND generated_at > NOW() - INTERVAL ? HOUR
     ORDER BY generated_at DESC LIMIT 1`,
    [page, MAX_AGE_HOURS]
  );
  const row = rows[0];
  if (!row) return null;
  return {
    page,
    date: row.summary_date,
    generatedAt: row.generated_at,
    headline: row.headline,
    dek: row.overview,
    paragraphs: typeof row.paragraphs === 'string' ? JSON.parse(row.paragraphs) : row.paragraphs,
  };
}

module.exports = {
  ensureCategorySummariesTable,
  saveCategorySummary,
  pagesDoneToday,
  getLatestCategorySummary,
};
