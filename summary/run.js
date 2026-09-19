// Manual runner for the briefing generator.
//   npm run summary            - generate and save a briefing (calls the API)
//   npm run summary -- --dry   - print the selected headlines and prompt size;
//                                no API call, nothing written to the database
require('dotenv').config();

const generateSummary = require('./generateSummary');
const { ensureSummariesTable } = require('../db/summaries');
const pool = require('../db/dbConfig');

(async () => {
  try {
    if (process.argv.includes('--dry')) {
      const { headlines, prompt } = await generateSummary({ dryRun: true });
      console.log(headlines.slice(0, 25).map((h) => `[${h.n}] w=${h.weight.toFixed(2)} x${h.outlets} ${h.page} | ${h.source} | ${h.title}`).join('\n'));
      console.log(`\n${headlines.length} headlines selected, prompt is ${prompt.length} characters.`);
    } else {
      await ensureSummariesTable();
      const result = await generateSummary();
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error('Summary run failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
