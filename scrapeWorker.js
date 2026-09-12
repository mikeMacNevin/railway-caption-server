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
const scrapeAllSites = require('./scraper/scrapeAllSites');
const pruneOldArticles = require('./db/pruneOldArticles');

async function runScrapeCycle() {
    try {
        await scrapeAllSites();
    } catch (err) {
        // A single site's failure is already caught inside scrapeWebsite.js
        // and doesn't reach here. This is the backstop for anything
        // unexpected in the cycle itself - log it and let the next
        // scheduled run try again, rather than crashing the worker.
        console.error('Scrape cycle failed:', err.message);
    }
}

async function runRetentionCycle() {
    try {
        const deleted = await pruneOldArticles();
        console.log(`Retention: pruned ${deleted} article(s) older than 7 days`);
    } catch (err) {
        console.error('Retention cycle failed:', err.message);
    }
}

console.log('Scraper worker starting...');

runScrapeCycle();
runRetentionCycle();

// Same 60-minute cadence server.js used before this split.
cron.schedule('*/60 * * * *', runScrapeCycle);

// Once nightly is plenty for a 7-day retention window - this worker
// process stays up continuously, so the startup run above is what
// actually catches a fresh deploy or a missed night, not this schedule.
cron.schedule('0 3 * * *', runRetentionCycle);
