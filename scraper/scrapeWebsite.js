const axios = require('axios');
const cheerio = require('cheerio');
const { isAllowedByRobots } = require('./checkRobots');
const { extractArticle } = require('./extractArticle');

// Without a timeout, one site that accepts the connection and then never
// answers would hang the whole (sequential) scrape cycle indefinitely.
const FETCH_TIMEOUT_MS = 20000;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Scrapes a single website. Returns an article, or null if the site couldn't
// be scraped - in which case the reason has already been logged, and
// scrapeAllSites reports which sites came back empty at the end of a cycle.
module.exports = async function scrapeWebsite(site) {
    try {
        const allowed = await isAllowedByRobots(site.url);
        if (!allowed) {
            console.warn(`Skipping ${site.name} - disallowed by robots.txt`);
            return null;
        }

        const response = await axios.get(site.url, {
            headers: { 'User-Agent': USER_AGENT },
            timeout: FETCH_TIMEOUT_MS,
        });

        const $ = cheerio.load(response.data);

        // Title and link come from the same card on the page - see
        // extractArticle.js for why they can't just be first-match-each.
        const found = extractArticle($, site);
        if (!found) {
            console.warn(`No usable headline found for ${site.name} (${site.url}) - its selectors may need updating`);
            return null;
        }

        let url;
        try {
            url = new URL(found.href, site.url).href;
        } catch (e) {
            console.warn(`Unparseable link for ${site.name}: ${found.href}`);
            return null;
        }

        const website = new URL(site.url).origin;

        // Favicon is cosmetic - an article is usable without one, so a missing
        // or odd icon must never drop it. Fall back to the /favicon.ico
        // convention when the page doesn't declare one.
        let siteIconUrl = $('link[rel="icon"]').attr('href')
            || $('link[rel="shortcut icon"]').attr('href')
            || $('link[rel="shortcut icon mask-icon"]').attr('href');
        try {
            siteIconUrl = new URL(siteIconUrl || '/favicon.ico', website).href;
        } catch (e) {
            siteIconUrl = new URL('/favicon.ico', website).href;
        }

        return { title: found.title, url, site_icon_url: siteIconUrl, page: site.page, website, source: site.name };
    } catch (error) {
        const reason = error.code === 'ECONNABORTED' ? `timed out after ${FETCH_TIMEOUT_MS / 1000}s` : error.message;
        console.error(`Error scraping ${site.name}: ${reason}`);
        return null;
    }
}
