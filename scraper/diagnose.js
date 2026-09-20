// Health check for the scrape list - runs every active site in newsSites.js
// through the same fetch + extraction the real scraper uses, and reports
// which ones are broken and why. Reads only: nothing is written to the
// database.
//
//   npm run diagnose                      check every site
//   npm run diagnose -- politics          only sites on one page
//   npm run diagnose -- --site="CNN"      only sites whose name contains this
//   npm run diagnose -- --all             also list sites that are working
//   npm run diagnose -- --json=out.json   also write the full report to a file
//
// Statuses: ok, robots, http, error, selectors, no-pair, suspicious.
// "suspicious" means it found a headline and link but they look wrong
// (link slug shares no words with the headline) - worth a human look.
require('dotenv').config({ quiet: true });

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { isAllowedByRobots } = require('./checkRobots');
const { extractArticle } = require('./extractArticle');
const newsSites = require('./newsSites');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const TIMEOUT_MS = 20000;
const CONCURRENCY = 6;

const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'will', 'has', 'have', 'are', 'was', 'were', 'its', 'his', 'her', 'their', 'after', 'over', 'into', 'about', 'than', 'how', 'why', 'what', 'who', 'when', 'says', 'said', 'not', 'but', 'can', 'could', 'would', 'more', 'just', 'out', 'you', 'they', 'them', 'here', 'now', 'may', 'all', 'one', 'two', 'new']);

function words(text) {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/[\s-]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
  );
}

// News URLs usually contain a slug built from the headline. When the link has
// a readable slug but shares no words with the headline, the two probably
// belong to different stories. Links with numeric-only paths can't be judged.
function slugMismatch(title, absoluteUrl) {
  const path = decodeURIComponent(new URL(absoluteUrl).pathname);
  const slugWords = [...words(path)].filter((w) => /^[a-z]+$/.test(w));
  if (slugWords.length < 4) return false;
  const titleWords = words(title);
  return !slugWords.some((w) => titleWords.has(w));
}

async function checkSite(site) {
  const result = { name: site.name, page: site.page, url: site.url, status: 'ok' };

  try {
    if (!(await isAllowedByRobots(site.url))) {
      return { ...result, status: 'robots', detail: 'disallowed by robots.txt' };
    }

    const started = Date.now();
    const response = await axios.get(site.url, {
      headers: { 'User-Agent': UA },
      timeout: TIMEOUT_MS,
      validateStatus: () => true, // record the status instead of throwing
    });
    result.ms = Date.now() - started;
    result.http = response.status;

    if (response.status >= 400) {
      return { ...result, status: 'http', detail: `HTTP ${response.status}` };
    }

    // A 2xx with an empty body is a bot-challenge / queue page, not the site
    // itself - report it as blocked rather than as a selector problem. These
    // tend to come and go with request volume, so re-check before disabling.
    if (typeof response.data !== 'string' || response.data.trim().length < 200) {
      return { ...result, status: 'http', detail: `HTTP ${response.status} with an empty body (likely a bot challenge - may be intermittent)` };
    }

    const $ = cheerio.load(response.data);
    const titleMatches = $(site.titleSelector).length;
    const urlMatches = $(site.urlSelector).length;
    Object.assign(result, { titleMatches, urlMatches });

    if (!titleMatches) {
      return { ...result, status: 'selectors', detail: 'title selector matches nothing' };
    }

    const found = extractArticle($, site);
    if (!found) {
      return {
        ...result,
        status: 'no-pair',
        detail: urlMatches
          ? `${titleMatches} title(s) found but none is a usable, current headline with a link`
          : 'titles found but the url selector matches nothing',
      };
    }

    const absolute = new URL(found.href, site.url).href;
    Object.assign(result, { title: found.title, absolute });

    if (slugMismatch(found.title, absolute)) {
      return { ...result, status: 'suspicious', detail: 'link slug shares no words with the headline' };
    }
    return result;
  } catch (err) {
    const code = err.code === 'ECONNABORTED' ? 'timeout' : (err.code || err.message);
    return { ...result, status: 'error', detail: String(code) };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const pageFilter = args.find((a) => !a.startsWith('--'));
  const siteFilter = (args.find((a) => a.startsWith('--site=')) || '').slice(7).toLowerCase();
  const jsonOut = (args.find((a) => a.startsWith('--json=')) || '').slice(7);
  const showAll = args.includes('--all');

  const sites = newsSites.filter((s) =>
    (!pageFilter || s.page === pageFilter) && (!siteFilter || s.name.toLowerCase().includes(siteFilter))
  );
  console.log(`Checking ${sites.length} site(s), ${CONCURRENCY} at a time...\n`);

  const results = new Array(sites.length);
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < sites.length) {
      const i = next++;
      const r = (results[i] = await checkSite(sites[i]));
      if (r.status !== 'ok') {
        console.log(`[${r.status.padEnd(10)}] ${r.page.padEnd(10)} ${r.name} - ${r.detail}`);
      } else if (showAll) {
        console.log(`[ok        ] ${r.page.padEnd(10)} ${r.name} - ${r.title.slice(0, 70)}`);
      }
    }
  }));

  const counts = {};
  results.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
  console.log('\nSummary:', Object.entries(counts).map(([k, v]) => `${k}=${v}`).join('  '));

  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify(results, null, 2));
    console.log(`Full report written to ${jsonOut}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
