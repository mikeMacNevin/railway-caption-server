// Manual runner for the daily newsletter.
//   npm run newsletter -- --dry   - write the latest briefing's email to
//                                   newsletter-preview.html; nothing is sent
//                                   or recorded, and no API key is needed
//   npm run newsletter            - run the real daily job now, in whatever
//                                   NEWSLETTER_MODE is set (draft or send)
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { getLatestSummary } = require('../db/summaries');
const { buildEmail } = require('./buttondown');
const { runDailyNewsletter } = require('./dailyEmail');
const pool = require('../db/dbConfig');

(async () => {
  try {
    if (process.argv.includes('--dry')) {
      const briefing = await getLatestSummary();
      if (!briefing) throw new Error('no briefing in the database');
      const email = buildEmail(briefing);
      const file = path.join(__dirname, '..', 'newsletter-preview.html');
      fs.writeFileSync(file, `<h1>${email.subject}</h1>\n${email.body}\n`);
      console.log(`Subject: ${email.subject}\nPreview written to ${file}`);
    } else {
      await runDailyNewsletter();
    }
  } catch (err) {
    console.error('Newsletter failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
