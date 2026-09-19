require('dotenv').config();

const Anthropic = require('@anthropic-ai/sdk');
const selectHeadlines = require('./selectHeadlines');
const { saveSummary } = require('../db/summaries');

// Haiku is plenty for weaving ~150 headlines into a few paragraphs, at
// pennies per day. Override with SUMMARY_MODEL to try a bigger one.
const MODEL = process.env.SUMMARY_MODEL || 'claude-haiku-4-5';

// A sanity floor, not a quality bar: below this the scrape probably failed
// or the database is nearly empty. One full scrape pass yields ~20 Front Page
// headlines; a day of hourly passes yields several times that.
const MIN_HEADLINES = 15;
const MIN_PARAGRAPHS = 2;
const MAX_PARAGRAPHS = 5;
const MAX_SOURCES_PER_PARAGRAPH = 6;

const SYSTEM_PROMPT = `You write the daily news briefing for caption.news, a news aggregator: a short written overview of what is happening in the news right now, in a few brief paragraphs, like the opening minute of a news broadcast. You are given a numbered list of recent headlines from many outlets. Each line looks like:
[12] (front page | politics | sports | ..., Outlet Name, 3h ago, 5 outlets) Headline text
The "N outlets" note means that many different outlets are running the same story.

How to write it:
- Lead with the biggest stories. Front Page headlines and newer headlines matter most, and so do stories many outlets are covering.
- Headlines from other sections (sports, tech, entertainment, ...) belong in the briefing only when a story is clearly big - several outlets covering it, such as a major game result. Mention those briefly, usually toward the end.
- Write 3 to 5 short paragraphs of 2 to 4 sentences each. Connect related stories in flowing prose. Do NOT list stories one by one, and do NOT write a summary per article.
- Use ONLY what the headlines themselves say. Do not add background, names, figures, causes, or outcomes that no headline states. Where headlines are vague or disagree, stay general or say so, and attribute hedged claims ("reports say", "according to ...").
- Neutral, plain prose. No opinion, no hype, no rhetorical questions. Do not mention headline numbers or outlet names in the text.
- For each paragraph, list the numbers of the headlines it draws on.

Respond with ONLY a JSON object, no markdown fences, in exactly this shape:
{
  "headline": "a short title for today's briefing, under 90 characters",
  "dek": "one sentence capturing the day's news",
  "paragraphs": [
    { "text": "the paragraph", "articles": [12, 47] }
  ]
}`;

function buildPrompt(headlines) {
  const lines = headlines.map((h) => {
    const age = h.ageHours < 1 ? 'just now' : `${Math.round(h.ageHours)}h ago`;
    const section = h.page === 'home' ? 'front page' : h.page;
    const outlets = h.outlets > 1 ? `, ${h.outlets} outlets` : '';
    return `[${h.n}] (${section}, ${h.source}, ${age}${outlets}) ${h.title}`;
  });
  return `Headlines:\n${lines.join('\n')}`;
}

function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('Model response contained no JSON object');
  return JSON.parse(text.slice(start, end + 1));
}

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

// Turns the model's raw JSON into what we store, resolving cited numbers to
// real article links and dropping anything that doesn't check out. The model
// never supplies a URL - only numbers we gave it - so a hallucinated link
// can't reach the page, and a paragraph that cites nothing real is dropped
// as ungrounded.
function validateBriefing(raw, headlines) {
  const byNumber = new Map(headlines.map((h) => [h.n, h]));

  const headline = clean(raw && raw.headline, 200);
  const dek = clean(raw && raw.dek, 500);
  if (!headline || !dek || !Array.isArray(raw.paragraphs)) {
    throw new Error('Model response missing headline, dek or paragraphs');
  }

  const paragraphs = [];
  for (const paragraph of raw.paragraphs.slice(0, MAX_PARAGRAPHS)) {
    const text = clean(paragraph && paragraph.text, 1200);
    const cited = Array.isArray(paragraph && paragraph.articles) ? paragraph.articles : [];

    const seen = new Set();
    const articles = [];
    for (const n of cited) {
      const match = byNumber.get(Number(n));
      if (!match || seen.has(match.url)) continue;
      seen.add(match.url);
      articles.push({ title: match.title, url: match.url, source: match.source });
      if (articles.length === MAX_SOURCES_PER_PARAGRAPH) break;
    }

    if (text && articles.length > 0) paragraphs.push({ text, articles });
  }

  if (paragraphs.length < MIN_PARAGRAPHS) {
    throw new Error(`Only ${paragraphs.length} valid paragraphs after validation (need ${MIN_PARAGRAPHS})`);
  }

  return { headline, dek, paragraphs };
}

// `dryRun` builds the prompt and stops - no API call, nothing written.
async function generateSummary({ dryRun = false } = {}) {
  const headlines = await selectHeadlines();
  if (headlines.length < MIN_HEADLINES) {
    throw new Error(`Only ${headlines.length} recent headlines - too few to summarize`);
  }

  const prompt = buildPrompt(headlines);
  if (dryRun) return { headlines, prompt, systemPrompt: SYSTEM_PROMPT };

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  if (response.stop_reason === 'max_tokens') throw new Error('Model response was cut off');
  const block = response.content.find((b) => b.type === 'text');
  if (!block) throw new Error(`No text in model response (stop_reason: ${response.stop_reason})`);

  const briefing = validateBriefing(extractJson(block.text), headlines);
  const id = await saveSummary({ ...briefing, model: MODEL, articleCount: headlines.length });

  console.log(
    `Summary ${id} saved: ${briefing.paragraphs.length} paragraphs from ${headlines.length} headlines ` +
    `(${response.usage.input_tokens} in / ${response.usage.output_tokens} out tokens, ${MODEL})`
  );
  return { id, ...briefing };
}

module.exports = generateSummary;
module.exports.validateBriefing = validateBriefing;
module.exports.buildPrompt = buildPrompt;
