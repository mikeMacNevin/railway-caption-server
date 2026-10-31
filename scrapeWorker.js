// Standalone entry point for the scraper, run as its OWN process/service -
// separate from server.js, which only serves API traffic. They share
// nothing but the database: this writes articles, server.js reads them.
//
// Why: scraping ~180 sources sequentially is the slow, CPU/IO-heavy part
// of this app. Running it inside the same process that's serving visitor
// requests means a slow scrape cycle competes with someone loading a page.
// Splitting it out means the API server never blocks on it, and either
// process can restart or fail independently without taking the other down.
//
// Deploy this as a second Railway service pointed at the same repo/branch,
// with start command `npm run worker` (or `node scrapeWorker.js`) instead
// of the default `npm start` - see server/README-worker.md.

require('dotenv').config();
const cron = require('node-cron');
const newsSites = require('./scraper/newsSites');
const scrapeSites = require('./scraper/scrapeSites');
const pruneOldArticles = require('./db/pruneOldArticles');
const generateSummary = require('./summary/generateSummary');
const { briefingDate, ensureSummariesTable, minutesSinceLastSummary } = require('./db/summaries');
const { ensureArticlesSchema } = require('./db/articlesSchema');
const { runDailyBlueskyPost } = require('./social/dailyPost');
const { generateCategorySummaries } = require('./summary/categorySummary');
const { submitToIndexNow } = require('./seo/indexNow');

// Every 10 minutes the worker scrapes two groups:
//   - the Front Page's sites, every time - that's where breaking news shows
//     up first, so it's never more than ~10 minutes stale. One homepage
//     request per outlet every 10 minutes is lighter than a single reader
//     refreshing the page.
//   - one sixth of every other site, in rotation, so each of those is still
//     fetched once an hour (as before) but the work is spread across the
//     hour instead of one ~15-minute burst.
const SCRAPE_INTERVAL_MINUTES = 10;
const ROTATION_SLICES = 6; // x 10 minutes = each site once an hour

const frontPageSites = newsSites.filter((site) => site.page === 'home');
const otherSites = newsSites.filter((site) => site.page !== 'home');

// Which sixth is due is worked out from the clock, not a counter, so a
// restart or redeploy picks up where the rotation left off instead of
// starting over at slice 0. Taking every sixth site (rather than six
// contiguous blocks) mixes categories in each slice, so every section gets
// something fresh every 10 minutes.
function currentRotationSlice() {
    const slot = Math.floor(Date.now() / (SCRAPE_INTERVAL_MINUTES * 60 * 1000)) % ROTATION_SLICES;
    return { slot, sites: otherSites.filter((_, i) => i % ROTATION_SLICES === slot) };
}

// Each group has its own "still running" flag, so a slow rotation slice can
// never hold up the Front Page (or the reverse) - a group only skips a run
// when its own previous run hasn't finished.
const running = new Set();

async function runScrape(group, label, sites) {
    if (running.has(group)) {
        console.warn(`${label} scrape skipped - the previous one is still running`);
        return;
    }
    running.add(group);
    try {
        await scrapeSites(sites, label);
    } catch (err) {
        // A single site's failure is already caught inside scrapeWebsite.js
        // and doesn't reach here. This is the backstop for anything
        // unexpected in the cycle itself - log it and let the next
        // scheduled run try again, rather than crashing the worker.
        console.error(`${label} scrape failed:`, err.message);
    } finally {
        running.delete(group);
    }
}

function runScrapeCycle() {
    const { slot, sites } = currentRotationSlice();
    runScrape('front', 'Front Page', frontPageSites);
    runScrape('rotation', `Rotation ${slot + 1}/${ROTATION_SLICES}`, sites);
}

async function runRetentionCycle() {
    try {
        const deleted = await pruneOldArticles();
        console.log(`Retention: pruned ${deleted} article(s) older than 7 days`);
    } catch (err) {
        console.error('Retention cycle failed:', err.message);
    }
}

// Regenerates the AI news briefing (see summary/). Cheap - one API call over
// ~150 headlines - but not free, so it runs on its own slower schedule, and
// a restart or redeploy doesn't trigger a fresh call if a briefing was
// written recently.
const SUMMARY_MIN_INTERVAL_MINUTES = 150;

async function runSummaryCycle() {
    if (!process.env.ANTHROPIC_API_KEY) {
        console.log('Summary: ANTHROPIC_API_KEY not set, skipping briefing generation');
        return;
    }
    try {
        await ensureSummariesTable();
        const age = await minutesSinceLastSummary();
        if (age < SUMMARY_MIN_INTERVAL_MINUTES) {
            console.log(`Summary: last briefing is ${age} min old, skipping`);
            return;
        }
        await generateSummary();
        // The dated page is new (or rewritten) and /briefing now shows it.
        await submitToIndexNow([`/briefing/${briefingDate()}`, '/briefing', '/briefing/archive']);
    } catch (err) {
        // A failed run just leaves the previous briefing up until the next
        // attempt - never worth crashing the scraper over.
        console.error('Summary cycle failed:', err.message);
    }
}

console.log('Scraper worker starting...');

// Widen columns that real-world headlines/links outgrow before the first
// scrape, so nothing gets dropped for length. A failure here is only logged -
// the scraper still runs, and saveToDatabase reports any row that won't fit.
ensureArticlesSchema()
    .catch((err) => console.error('Articles schema check failed:', err.message))
    .then(() => {
        runScrapeCycle();
        runRetentionCycle();
        runSummaryCycle();
    });

cron.schedule(`*/${SCRAPE_INTERVAL_MINUTES} * * * *`, runScrapeCycle);

// Once nightly is plenty for a 7-day retention window - this worker
// process stays up continuously, so the startup run above is what
// actually catches a fresh deploy or a missed night, not this schedule.
cron.schedule('0 3 * * *', runRetentionCycle);

// Every 3 hours. The :20 offset dates from the hourly scrape; with scrapes
// every 10 minutes the headlines are at most one cycle old whenever it runs.
cron.schedule('20 */3 * * *', runSummaryCycle);

// Shares today's briefing on Bluesky. Tried hourly from 7 to 11am Eastern -
// after the overnight briefings, in time for the morning audience. Only the
// first successful attempt posts (see social/dailyPost.js); the later ones
// are there to catch a restart or a failed attempt, not to post again.
async function runSocialCycle() {
    try {
        await runDailyBlueskyPost();
    } catch (err) {
        console.error('Social cycle failed:', err.message);
    }
}

cron.schedule('5 7-11 * * *', runSocialCycle, { timezone: 'America/New_York' });

// Writes the daily overview shown above each category page's headlines.
// First attempt at 6:40am Eastern, once every site has been through a full
// hourly rotation since 5:40 and refreshed the overnight headlines; the later hourly attempts only fill in categories
// that failed (see generateCategorySummaries), so a normal day makes just one
// model call per category.
async function runCategorySummaryCycle() {
    if (!process.env.ANTHROPIC_API_KEY) {
        console.log('Category summaries: ANTHROPIC_API_KEY not set, skipping');
        return;
    }
    try {
        const { written } = await generateCategorySummaries();
        await submitToIndexNow(written.map((page) => `/${page}`));
    } catch (err) {
        console.error('Category summary cycle failed:', err.message);
    }
}

cron.schedule('40 6-12 * * *', runCategorySummaryCycle, { timezone: 'America/New_York' });
