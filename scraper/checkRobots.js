const axios = require('axios');
const robotsParser = require('robots-parser');

// We identify to the target site as a regular browser (see scrapeWebsite.js),
// not as a named bot, so the only group of a robots.txt that actually
// applies to us is the wildcard one - checking against '*' is the correct,
// conservative interpretation of "are we allowed to fetch this".
const CHECK_USER_AGENT = '*';

const FETCH_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // once-a-day per origin, per the recommendation

// { [origin]: { robots: <parsed robots-parser instance>, fetchedAt: number } }
const cache = {};

async function getRobots(origin) {
    const cached = cache[origin];
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        return cached.robots;
    }

    const robotsUrl = `${origin}/robots.txt`;
    let body = '';

    try {
        const response = await axios.get(robotsUrl, {
            headers: { 'User-Agent': FETCH_UA },
            timeout: 8000,
            // A robots.txt that itself redirects, 4xx's, or 5xx's is treated
            // as "no restrictions" below - only a genuine 2xx body is parsed.
            validateStatus: (status) => status >= 200 && status < 300,
        });
        body = response.data || '';
    } catch (err) {
        // No robots.txt (404), unreachable, timed out, etc. - per the Robots
        // Exclusion Protocol, the absence of a robots.txt means no
        // restrictions apply. Fail open, not closed.
        body = '';
    }

    const robots = robotsParser(robotsUrl, body);
    cache[origin] = { robots, fetchedAt: Date.now() };
    return robots;
}

// Returns true if we're allowed to fetch `url`, false if robots.txt
// explicitly disallows it for '*'. Never throws - any failure fails open
// (allowed), since a broken robots.txt check should never be the reason a
// legitimate source stops working.
async function isAllowedByRobots(url) {
    try {
        const origin = new URL(url).origin;
        const robots = await getRobots(origin);
        return robots.isAllowed(url, CHECK_USER_AGENT) !== false;
    } catch (err) {
        return true;
    }
}

module.exports = { isAllowedByRobots };
