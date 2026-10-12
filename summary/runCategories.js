// Manual runner for the per-category overviews.
//   npm run summary:categories   - write and save today's overview for every
//                                  category that doesn't have one yet (calls
//                                  the API once per missing category)
require('dotenv').config();

const { generateCategorySummaries } = require('./categorySummary');
const pool = require('../db/dbConfig');

(async () => {
  try {
    const { written, failed } = await generateCategorySummaries();
    console.log(`Written: ${written.join(', ') || 'none'}. Failed: ${failed.join(', ') || 'none'}.`);
    if (failed.length) process.exitCode = 1;
  } catch (err) {
    console.error('Category summaries failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
