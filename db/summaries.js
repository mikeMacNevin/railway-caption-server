require('dotenv').config();

const pool = require('./dbConfig');

// The site's audience is US-based, so "today's briefing" rolls over at
// Eastern midnight rather than UTC (which would start a new day at 8pm).
const BRIEFING_TZ = 'America/New_York';

function briefingDate(date = new Date()) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: BRIEFING_TZ }).format(date);
}

// Unlike `articles`, nothing prunes this table - the archive of past
// briefings is the point, so it's deliberately exempt from the 7-day
// retention job in pruneOldArticles.js. A few rows a day is negligible.
//
// `overview` holds the one-sentence dek. `paragraphs` is the current format;
// `stories` is the earlier per-story format, kept nullable so rows written
// before the change survive. Reads below only return rows that have
// `paragraphs`, so those older rows are simply ignored.
async function ensureSummariesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS summaries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      summary_date DATE NOT NULL,
      headline VARCHAR(255) NOT NULL,
      overview TEXT NOT NULL,
      stories JSON NULL,
      paragraphs JSON NULL,
      model VARCHAR(64) NOT NULL,
      article_count INT NOT NULL,
      INDEX idx_summaries_generated_at (generated_at),
      INDEX idx_summaries_date (summary_date, generated_at)
    )
  `);

  // Upgrade a table created before the paragraphs format existed.
  const [[{ present }]] = await pool.query(
    `SELECT COUNT(*) AS present FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'summaries' AND COLUMN_NAME = 'paragraphs'`
  );
  if (!present) {
    await pool.query('ALTER TABLE summaries ADD COLUMN paragraphs JSON NULL, MODIFY COLUMN stories JSON NULL');
  }
}

async function saveSummary({ headline, dek, paragraphs, model, articleCount }) {
  const [result] = await pool.execute(
    'INSERT INTO summaries (summary_date, headline, overview, paragraphs, model, article_count) VALUES (?, ?, ?, ?, ?, ?)',
    [briefingDate(), headline, dek, JSON.stringify(paragraphs), model, articleCount]
  );
  return result.insertId;
}

// Age computed in SQL rather than from the returned Date, so it can't be
// thrown off by a timezone mismatch between this process and the database.
async function minutesSinceLastSummary() {
  const [[row]] = await pool.query(
    'SELECT TIMESTAMPDIFF(MINUTE, MAX(generated_at), NOW()) AS age FROM summaries WHERE paragraphs IS NOT NULL'
  );
  return row.age === null ? Infinity : row.age;
}

function shape(row) {
  if (!row) return null;
  return {
    date: row.summary_date,
    generatedAt: row.generated_at,
    headline: row.headline,
    dek: row.overview,
    // mysql2 parses JSON columns already; the string check is a guard for
    // driver/config differences.
    paragraphs: typeof row.paragraphs === 'string' ? JSON.parse(row.paragraphs) : row.paragraphs,
    articleCount: row.article_count,
  };
}

const COLUMNS = `DATE_FORMAT(summary_date, '%Y-%m-%d') AS summary_date, generated_at, headline, overview, paragraphs, article_count`;

async function getLatestSummary() {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM summaries WHERE paragraphs IS NOT NULL ORDER BY generated_at DESC LIMIT 1`
  );
  return shape(rows[0]);
}

// Several runs happen per day; the last one is that day's final version.
async function getSummaryForDate(date) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM summaries WHERE summary_date = ? AND paragraphs IS NOT NULL ORDER BY generated_at DESC LIMIT 1`,
    [date]
  );
  return shape(rows[0]);
}

async function listSummaryDates(limit = 30) {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(s.summary_date, '%Y-%m-%d') AS date, s.headline
     FROM summaries s
     JOIN (
       SELECT summary_date, MAX(generated_at) AS latest
       FROM summaries WHERE paragraphs IS NOT NULL GROUP BY summary_date
     ) l ON l.summary_date = s.summary_date AND l.latest = s.generated_at
     WHERE s.paragraphs IS NOT NULL
     ORDER BY s.summary_date DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}

module.exports = {
  briefingDate,
  ensureSummariesTable,
  saveSummary,
  minutesSinceLastSummary,
  getLatestSummary,
  getSummaryForDate,
  listSummaryDates,
};
