// Manual runner for the daily Bluesky post.
//   npm run post:bluesky -- --dry  - print the post built from the latest
//                                    briefing; nothing is posted or written
//   npm run post:bluesky           - run the real daily job now (posts today's
//                                    briefing if it hasn't been posted yet)
require('dotenv').config();

const { getLatestSummary } = require('../db/summaries');
const { buildPostText, briefingUrl } = require('./bluesky');
const { runDailyBlueskyPost } = require('./dailyPost');
const pool = require('../db/dbConfig');

(async () => {
  try {
    if (process.argv.includes('--dry')) {
      const briefing = await getLatestSummary();
      if (!briefing) throw new Error('no briefing in the database');
      const text = buildPostText(briefing);
      console.log(`--- post text (${[...new Intl.Segmenter().segment(text)].length}/300) ---\n${text}`);
      console.log(`--- link card ---\n${briefingUrl(briefing.date)}\n${briefing.headline}\n${briefing.dek}`);
    } else {
      await runDailyBlueskyPost();
    }
  } catch (err) {
    console.error('Bluesky post failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
