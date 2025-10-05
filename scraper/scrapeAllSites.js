const newsSites = require('./newsSites');
const scrapeWebsite = require('./scrapeWebsite')
const saveToDatabase = require('../db/saveToDatabase')


// Main function to scrape all websites and save to database
module.exports = async function scrapeAllSites() {
    console.log('Starting scrape at', new Date().toISOString());
    for (const site of newsSites) {
        const article = await scrapeWebsite(site);
        if (article) {
            await saveToDatabase(article);
        }
    }
    console.log('Scrape completed');
}