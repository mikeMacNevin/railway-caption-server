// A short daily written overview for one category page (celebs, sports,
// tech, ...), shown above that page's headlines. Same approach as the main
// briefing (generateSummary.js) - the model only ever cites numbered
// headlines we gave it, and validateBriefing drops anything ungrounded - but
// scoped to one section and shorter.
//
// Why it exists: a category page is otherwise just a list of links to other
// sites, which Google declines to index ("Crawled - currently not indexed")
// for having no original content. This gives each page some.
require('dotenv').config();

const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../db/dbConfig');
const { clusterStories } = require('./selectHeadlines');
const { validateBriefing, extractJson } = require('./generateSummary');
const { ensureCategorySummariesTable, saveCategorySummary, pagesDoneToday } = require('../db/categorySummaries');

const MODEL = process.env.CATEGORY_SUMMARY_MODEL || 'claude-haiku-4-5';

// Display names, as used in the prompt ("today's celebrity news").
const CATEGORY_LABELS = {
  politics: 'politics',
  finance: 'finance and markets',
  world: 'world',
  sports: 'sports',
  tech: 'tech',
  celebs: 'celebrity and entertainment',
  movies: 'movie',
  tv: 'TV',
  videogames: 'video game',
  travel: 'travel',
  health: 'health',
  science: 'science',
};

// Slower sections (travel, science) can go quiet overnight, so look back a
// bit further than the main briefing's 24 hours.
const WINDOW_HOURS = 36;
const MAX_HEADLINES = 80;
const MAX_PER_SOURCE = 4;
const HALF_LIFE_HOURS = 10;
const OUTLET_BOOST = 0.35;
const MAX_OUTLET_BOOST = 3;
const MIN_HEADLINES = 10;
const MAX_PARAGRAPHS = 3;

function systemPrompt(label) {
  return `You write a short daily overview of today's ${label} news for caption.news, a news aggregator. It appears at the top of the site's ${label} page, above the list of headlines. You are given a numbered list of recent ${label} headlines from many outlets. Each line looks like:
[12] (Outlet Name, 3h ago, 4 outlets) Headline text
The "N outlets" note means that many different outlets are running the same story.

How to write it:
- Lead with the biggest stories: ones many outlets are covering, and newer ones.
- Write 2 or 3 short paragraphs of 2 to 3 sentences each. Connect related stories in flowing prose. Do NOT list stories one by one, and do NOT write a summary per article.
- Every sentence must say something specific - who did what. If a headline is too vague to support a specific sentence, leave it out. Never write filler such as "debate continues", "remains a hot topic" or "continues to draw attention". Two concrete paragraphs are better than three padded ones.
- Use ONLY what the headlines themselves say. Do not add background, names, figures, causes, or outcomes that no headline states. Where headlines are vague or disagree, stay general or say so.
- Headlines are compressed and full of nicknames and shorthand. Do not reinterpret one: if you are not certain what it means - who a nickname refers to, who did what to whom - leave it out rather than guess.
- Rumors, allegations and unconfirmed reports must be attributed as such ("reports say", "according to ..."), never stated as fact.
- Neutral, plain prose. No opinion, no hype, no rhetorical questions. Do not mention headline numbers or outlet names in the text.
- For each paragraph, list the numbers of the headlines it draws on.

Respond with ONLY a JSON object, no markdown fences, in exactly this shape:
{
  "headline": "a short title for today's ${label} overview, under 90 characters",
  "dek": "one sentence capturing today's ${label} news",
  "paragraphs": [
    { "text": "the paragraph", "articles": [12, 47] }
  ]
}`;
}

// Ranks one category's headlines, best first, each with a 1-based `n`.
// `rows` need title, url, source and age_minutes. Pure, so the preview
// script can feed it live data instead of the local database.
function rankCategoryHeadlines(rows) {
  const byUrl = new Map();
  for (const row of rows) {
    const existing = byUrl.get(row.url);
    if (!existing || row.age_minutes < existing.age_minutes) byUrl.set(row.url, row);
  }
  const items = [...byUrl.values()];
  const clusters = clusterStories(items);

  const scored = items.map((row, i) => {
    const outlets = clusters[i].sources.size;
    const ageHours = row.age_minutes / 60;
    const recency = Math.pow(0.5, ageHours / HALF_LIFE_HOURS);
    const boost = Math.min(1 + OUTLET_BOOST * (outlets - 1), MAX_OUTLET_BOOST);
    return { title: row.title, url: row.url, source: row.source, ageHours, outlets, weight: recency * boost };
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
}

async function loadCategoryRows(page) {
  const [rows] = await pool.query(
    `SELECT title, url, source, TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS age_minutes
     FROM articles WHERE page = ? AND created_at > NOW() - INTERVAL ? HOUR`,
    [page, WINDOW_HOURS]
  );
  return rows;
}

function buildCategoryPrompt(headlines) {
  const lines = headlines.map((h) => {
    const age = h.ageHours < 1 ? 'just now' : `${Math.round(h.ageHours)}h ago`;
    const outlets = h.outlets > 1 ? `, ${h.outlets} outlets` : '';
    return `[${h.n}] (${h.source}, ${age}${outlets}) ${h.title}`;
  });
  return `Headlines:\n${lines.join('\n')}`;
}

// Returns { headline, dek, paragraphs, usage } without saving anything.
// Pass `rows` to summarize given headlines instead of reading the database.
async function writeCategorySummary(page, { rows } = {}) {
  const label = CATEGORY_LABELS[page];
  if (!label) throw new Error(`Unknown category: ${page}`);

  const headlines = rankCategoryHeadlines(rows || (await loadCategoryRows(page)));
  if (headlines.length < MIN_HEADLINES) {
    throw new Error(`Only ${headlines.length} recent ${page} headlines - too few to summarize`);
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt(label),
    messages: [{ role: 'user', content: buildCategoryPrompt(headlines) }],
  });

  if (response.stop_reason === 'max_tokens') throw new Error('Model response was cut off');
  const block = response.content.find((b) => b.type === 'text');
  if (!block) throw new Error(`No text in model response (stop_reason: ${response.stop_reason})`);

  const raw = extractJson(block.text);
  if (raw && Array.isArray(raw.paragraphs)) raw.paragraphs = raw.paragraphs.slice(0, MAX_PARAGRAPHS);
  const summary = validateBriefing(raw, headlines);
  return { ...summary, articleCount: headlines.length, model: MODEL, usage: response.usage };
}

// Writes and saves today's overview for every category that doesn't have one
// yet. One failing category (too few headlines, a bad model response) is
// logged and skipped - the next scheduled attempt retries just the gaps.
async function generateCategorySummaries() {
  await ensureCategorySummariesTable();
  const done = await pagesDoneToday();
  const results = { written: [], failed: [] };

  for (const page of Object.keys(CATEGORY_LABELS)) {
    if (done.has(page)) continue;
    try {
      const summary = await writeCategorySummary(page);
      const id = await saveCategorySummary(page, summary);
      results.written.push(page);
      console.log(
        `Category summary ${id} saved for ${page}: ${summary.paragraphs.length} paragraphs from ` +
        `${summary.articleCount} headlines (${summary.usage.input_tokens} in / ${summary.usage.output_tokens} out tokens)`
      );
    } catch (err) {
      results.failed.push(page);
      console.error(`Category summary failed for ${page}:`, err.message);
    }
  }
  return results;
}

module.exports = { CATEGORY_LABELS, writeCategorySummary, rankCategoryHeadlines, generateCategorySummaries };
