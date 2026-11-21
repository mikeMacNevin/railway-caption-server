// Emails today's briefing to newsletter subscribers once per day, through
// Buttondown. Scheduled from scrapeWorker.js to try every hour through the
// early morning; like the Bluesky post (social/dailyPost.js), a row in
// social_posts makes every attempt after the first successful one a no-op.
//
// NEWSLETTER_MODE (worker service) decides what happens:
//   unset / anything else - nothing (the default, so a deploy can't email anyone)
//   draft                 - create a Buttondown DRAFT each day, sent to nobody;
//                           for checking how the email looks before going live
//   send                  - email every subscriber
// Draft and send are tracked separately, so switching from draft to send on
// a day that already has a draft still sends that day's email.
const { briefingDate, getSummaryForDate } = require('../db/summaries');
const { ensureSocialPostsTable, claimPost, recordPostUri, releasePost } = require('../db/socialPosts');
const { buildEmail, createEmail, ButtondownRejected } = require('./buttondown');

const MODES = {
  draft: { platform: 'newsletter-draft', status: 'draft' },
  send: { platform: 'newsletter', status: 'about_to_send' },
};

async function runDailyNewsletter() {
  const mode = MODES[process.env.NEWSLETTER_MODE];
  if (!mode) {
    console.log('Newsletter: NEWSLETTER_MODE is not "draft" or "send", skipping');
    return;
  }
  if (!process.env.BUTTONDOWN_API_KEY) {
    console.log('Newsletter: BUTTONDOWN_API_KEY not set, skipping');
    return;
  }

  // Only today's briefing - never email yesterday's if today's hasn't been
  // written yet; the next hourly attempt will catch it.
  const today = briefingDate();
  const briefing = await getSummaryForDate(today);
  if (!briefing) {
    console.log(`Newsletter: no briefing for ${today} yet, will retry next hour`);
    return;
  }

  await ensureSocialPostsTable();
  if (!(await claimPost(mode.platform, today))) {
    return; // already done today
  }

  try {
    const id = await createEmail(buildEmail(briefing), mode.status);
    await recordPostUri(mode.platform, today, id);
    console.log(`Newsletter: created ${today} email as ${mode.status} (${id})`);
  } catch (err) {
    if (err instanceof ButtondownRejected && err.code === 'email_duplicate') {
      // Buttondown already has this email - count the day as done.
      await recordPostUri(mode.platform, today, 'duplicate');
      console.warn(`Newsletter: Buttondown reports ${today} as a duplicate, not sending again`);
      return;
    }
    if (err instanceof ButtondownRejected) {
      // Definitely not created, so the next hourly attempt may try again.
      // `sending_requires_confirmation` means Buttondown wants the account
      // owner to approve API sending in its dashboard first.
      await releasePost(mode.platform, today);
    } else {
      // Timeout or network error: the email may already exist. Keep the claim
      // so we never risk emailing subscribers twice - better to miss a day.
      // Check the Buttondown dashboard and delete the social_posts row to retry.
      await recordPostUri(mode.platform, today, 'unknown - check Buttondown');
    }
    throw err;
  }
}

module.exports = { runDailyNewsletter };
