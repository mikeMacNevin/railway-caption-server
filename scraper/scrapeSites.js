const scrapeWebsite = require('./scrapeWebsite');
const saveToDatabase = require('../db/saveToDatabase');

// Scrapes the given sites and saves what it finds. Ends with a one-line
// tally (and how many headlines are new rather than a site's unchanged top
// story) plus the names of any sites that came back empty, so a broken
// selector shows up in the logs instead of vanishing silently.
module.exports = async function scrapeSites(sites, label) {
    console.log(`Starting ${label} scrape (${sites.length} sites) at`, new Date().toISOString());

    let saved = 0;
    let fresh = 0;
    const failed = [];

    for (const site of sites) {
        const article = await scrapeWebsite(site);
        const result = article && await saveToDatabase(article);
        if (result) {
            saved++;
            if (result === 'new') fresh++;
        } else {
            failed.push(`${site.name} (${site.page})`);
        }
    }

    console.log(`${label} scrape completed: ${saved} of ${sites.length} sites saved, ${fresh} new headline(s)`);
    if (failed.length > 0) {
        console.warn(`${label} scrape problems (${failed.length}): ${failed.join(', ')}`);
    }
}
