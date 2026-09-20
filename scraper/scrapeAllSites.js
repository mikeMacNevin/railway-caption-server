const newsSites = require('./newsSites');
const scrapeWebsite = require('./scrapeWebsite');
const saveToDatabase = require('../db/saveToDatabase');

// Scrapes every configured site and saves what it finds. Ends with a
// one-line tally plus the names of any sites that came back empty, so a
// broken selector shows up in the logs instead of vanishing silently.
module.exports = async function scrapeAllSites() {
    console.log('Starting scrape at', new Date().toISOString());

    let saved = 0;
    const failed = [];

    for (const site of newsSites) {
        const article = await scrapeWebsite(site);
        if (article && await saveToDatabase(article)) {
            saved++;
        } else {
            failed.push(`${site.name} (${site.page})`);
        }
    }

    console.log(`Scrape completed: ${saved} of ${newsSites.length} sites saved`);
    if (failed.length > 0) {
        console.warn(`Scrape problems (${failed.length}): ${failed.join(', ')}`);
    }
}
