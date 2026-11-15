// Spots a very big story breaking between the regular briefing runs, so the
// briefing can be rewritten within the hour instead of waiting up to 3 hours
// for the next scheduled one.
//
// The signal is spread, not just volume. An ordinary big story (a court
// ruling, a political fight) gets covered by plenty of outlets, but mostly
// within one or two sections. A story like the Nov 13 FAA nationwide ground
// stop is everywhere at once - Front Page, politics, finance, travel,
// celebrity and sports outlets all ran it within the first ~90 minutes,
// because it touched all of them. Requiring that spread, on top of a burst of
// outlets that all *first* picked it up in the last few hours, is what keeps
// this to the handful of stories a year that warrant a rewrite.
//
// No model call happens here - this runs every 10 minutes and only costs one
// query. A briefing is regenerated only when something qualifies AND the
// current briefing doesn't already cover it.
const pool = require('../db/dbConfig');
const { clusterStories, titleTokens, sameStory } = require('./selectHeadlines');

// A story must have broken recently: every headline counted was first seen
// inside this window.
const WINDOW_HOURS = 3;
// Distinct outlets running it, across all sections.
const MIN_OUTLETS = 6;
// Distinct sections it appears in. The Front Page must be one of them.
const MIN_SECTIONS = 3;

// first_seen (created_at), not last_seen_at - a story every site has been
// leading with all day isn't breaking, however many outlets carry it.
const query = `
SELECT title, url, source, page
FROM articles
WHERE created_at > NOW() - INTERVAL ? HOUR
`;

// True when any headline in the story is - or reads as the same story as -
// one the current briefing already cites.
function alreadyCovered(story, briefing) {
  if (!briefing) return false;
  const cited = briefing.paragraphs.flatMap((paragraph) => paragraph.articles);
  const citedUrls = new Set(cited.map((article) => article.url));
  const citedTokens = cited.map((article) => titleTokens(article.title));

  return story.headlines.some((headline) => {
    if (citedUrls.has(headline.url)) return true;
    const tokens = titleTokens(headline.title);
    return citedTokens.some((other) => {
      let shared = 0;
      for (const token of tokens) if (other.has(token)) shared++;
      return sameStory(shared, tokens, other);
    });
  });
}

// Pure, so it can be replayed against saved headlines. `rows` need title,
// url, source and page. Returns the biggest qualifying story the briefing
// doesn't already cover, or null.
function findBreakingStory(rows, briefing) {
  const byUrl = new Map();
  for (const row of rows) {
    if (!byUrl.has(row.url)) byUrl.set(row.url, row);
  }
  const items = [...byUrl.values()];
  const clusters = clusterStories(items);

  // clusterStories hands back one shared object per story; collect each
  // story's headlines and the sections they appeared in.
  const stories = new Map();
  items.forEach((item, i) => {
    const cluster = clusters[i];
    if (!stories.has(cluster)) stories.set(cluster, { outlets: cluster.sources.size, pages: new Set(), headlines: [] });
    const story = stories.get(cluster);
    story.pages.add(item.page);
    story.headlines.push(item);
  });

  const qualifying = [...stories.values()]
    .filter((story) => story.outlets >= MIN_OUTLETS && story.pages.size >= MIN_SECTIONS && story.pages.has('home'))
    .filter((story) => !alreadyCovered(story, briefing))
    .sort((a, b) => b.outlets - a.outlets);

  return qualifying[0] || null;
}

async function detectBreakingStory(briefing) {
  const [rows] = await pool.query(query, [WINDOW_HOURS]);
  return findBreakingStory(rows, briefing);
}

module.exports = { detectBreakingStory, findBreakingStory };
