// Posts today's briefing to Bluesky once per day. Scheduled from
// scrapeWorker.js to try every hour through the morning; the social_posts
// table makes every attempt after the first successful one a no-op, so a
// worker restart, redeploy or failed attempt just gets picked up by the
// next hourly try instead of double-posting or skipping the day.
const { briefingDate, getSummaryForDate } = require('../db/summaries');
const { ensureSocialPostsTable, claimPost, recordPostUri, releasePost } = require('../db/socialPosts');
const { postBriefingToBluesky } = require('./bluesky');

const PLATFORM = 'bluesky';

async function runDailyBlueskyPost() {
  if (!process.env.BLUESKY_HANDLE || !process.env.BLUESKY_APP_PASSWORD) {
    console.log('Social: Bluesky credentials not set, skipping daily post');
    return;
  }

  // Only today's briefing - never re-share yesterday's if today's hasn't
  // been generated yet; the next hourly attempt will catch it.
  const today = briefingDate();
  const briefing = await getSummaryForDate(today);
  if (!briefing) {
    console.log(`Social: no briefing for ${today} yet, will retry next hour`);
    return;
  }

  await ensureSocialPostsTable();
  if (!(await claimPost(PLATFORM, today))) {
    return; // already posted today
  }

  try {
    const uri = await postBriefingToBluesky(briefing);
    await recordPostUri(PLATFORM, today, uri);
    console.log(`Social: posted ${today} briefing to Bluesky (${uri})`);
  } catch (err) {
    await releasePost(PLATFORM, today);
    throw err;
  }
}

module.exports = { runDailyBlueskyPost };
