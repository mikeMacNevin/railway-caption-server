const pool = require('../db/dbConfig');

const WINDOW_HOURS = 24;
const MAX_HEADLINES = 150;
// Keeps one prolific outlet from filling the list and skewing which stories
// look "big" - a story covered by many *different* outlets is the signal.
const MAX_PER_SOURCE = 5;
// A headline loses half its weight every 8 hours.
const HALF_LIFE_HOURS = 8;
// Front Page headlines count triple; every other section counts once.
const HOME_WEIGHT = 3;
// A headline from any other section only makes the cut when this many
// different outlets are running the same story (or the Front Page has it
// too). That's how a big game result in Sports gets in while ordinary
// section filler doesn't.
const MIN_OUTLETS_FOR_OTHER_PAGES = 3;
// Each extra outlet on a story adds this much weight, up to the cap.
const OUTLET_BOOST = 0.35;
const MAX_OUTLET_BOOST = 3;

// Age is computed in SQL (not from created_at as a JS Date) so it can't be
// skewed by a timezone mismatch between this process and the database.
const query = `
SELECT title, url, source, page, TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS age_minutes
FROM articles
WHERE created_at > NOW() - INTERVAL ? HOUR
`;

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'will', 'has', 'have', 'had', 'are', 'was', 'were',
  'its', 'his', 'her', 'their', 'after', 'over', 'into', 'about', 'than', 'how', 'why', 'what', 'who',
  'when', 'where', 'says', 'said', 'new', 'not', 'but', 'can', 'could', 'would', 'more', 'just', 'out',
  'your', 'you', 'they', 'them', 'here', 'now', 'may', 'all', 'one', 'two', 'get', 'gets', 'live', 'news',
]);

function titleTokens(title) {
  const tokens = new Set();
  for (let word of title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)) {
    if (word.length < 3 || /^\d+$/.test(word) || STOPWORDS.has(word)) continue;
    if (word.length > 4 && word.endsWith('s')) word = word.slice(0, -1); // crude plural fold
    tokens.add(word);
  }
  return tokens;
}

// Headlines about one event share their distinctive words (names, places)
// even when phrased differently. Two headlines count as "the same story" when
// they share enough of them. This only has to be good enough to *rank* - the
// model does the real grouping when it writes the briefing.
function sameStory(sharedCount, a, b) {
  const union = a.size + b.size - sharedCount;
  return sharedCount >= 3 || (sharedCount >= 2 && sharedCount / union >= 0.4);
}

// Groups items into stories and returns, per item, how many distinct outlets
// are covering that story and whether the Front Page has it.
function clusterStories(items) {
  const tokens = items.map((item) => titleTokens(item.title));

  // Inverted index so only headlines that share a word get compared at all.
  const index = new Map();
  tokens.forEach((set, i) => {
    for (const token of set) {
      if (!index.has(token)) index.set(token, []);
      index.get(token).push(i);
    }
  });

  const parent = items.map((_, i) => i);
  const find = (i) => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };

  for (let i = 0; i < items.length; i++) {
    const shared = new Map();
    for (const token of tokens[i]) {
      for (const j of index.get(token)) {
        if (j > i) shared.set(j, (shared.get(j) || 0) + 1);
      }
    }
    for (const [j, count] of shared) {
      if (sameStory(count, tokens[i], tokens[j])) parent[find(j)] = find(i);
    }
  }

  const clusters = new Map();
  items.forEach((item, i) => {
    const root = find(i);
    if (!clusters.has(root)) clusters.set(root, { sources: new Set(), hasHome: false });
    const cluster = clusters.get(root);
    cluster.sources.add(item.source);
    if (item.page === 'home') cluster.hasHome = true;
  });

  return items.map((_, i) => clusters.get(find(i)));
}

// Returns the headlines to summarize, best first, each with a 1-based `n`
// the model cites back so every claim in the briefing maps to a real link.
module.exports = async function selectHeadlines() {
  const [rows] = await pool.query(query, [WINDOW_HOURS]);

  // The same article can be on several pages (e.g. home and politics) - keep
  // the Front Page placement if there is one, otherwise any.
  const byUrl = new Map();
  for (const row of rows) {
    const existing = byUrl.get(row.url);
    if (!existing || (row.page === 'home' && existing.page !== 'home')) byUrl.set(row.url, row);
  }
  const items = [...byUrl.values()];
  const clusters = clusterStories(items);

  const scored = [];
  items.forEach((row, i) => {
    const { sources, hasHome } = clusters[i];
    if (row.page !== 'home' && !hasHome && sources.size < MIN_OUTLETS_FOR_OTHER_PAGES) return;

    const ageHours = row.age_minutes / 60;
    const recency = Math.pow(0.5, ageHours / HALF_LIFE_HOURS);
    const boost = Math.min(1 + OUTLET_BOOST * (sources.size - 1), MAX_OUTLET_BOOST);
    scored.push({
      title: row.title,
      url: row.url,
      source: row.source,
      page: row.page,
      ageHours,
      outlets: sources.size,
      weight: (row.page === 'home' ? HOME_WEIGHT : 1) * recency * boost,
    });
  });

  const perSource = {};
  const picked = [];
  for (const item of scored.sort((a, b) => b.weight - a.weight)) {
    if ((perSource[item.source] || 0) >= MAX_PER_SOURCE) continue;
    perSource[item.source] = (perSource[item.source] || 0) + 1;
    picked.push(item);
    if (picked.length === MAX_HEADLINES) break;
  }

  return picked.map((item, i) => ({ n: i + 1, ...item }));
};
