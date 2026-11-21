// Turns a briefing into an email and hands it to Buttondown's API.
//
// Needs BUTTONDOWN_API_KEY (from buttondown.com/requests), on the worker
// service only.
//
// CAREFUL: Buttondown's create-email endpoint SENDS TO EVERY SUBSCRIBER by
// default - `status` defaults to `about_to_send`. createEmail() therefore
// always passes a status explicitly; never drop it.

const SITE_URL = 'https://www.caption.news';
const API_URL = 'https://api.buttondown.com/v1/emails';
// Pinned so a Buttondown API change can't silently alter what this sends.
const API_VERSION = '2026-04-01';
const REQUEST_TIMEOUT_MS = 30000;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Two links from one outlet get a number so they're distinguishable - same
// as the briefing page (client/src/view/briefing/Briefing.js).
function sourceLabels(articles) {
  const totals = {};
  articles.forEach((a) => { totals[a.source] = (totals[a.source] || 0) + 1; });
  const seen = {};
  return articles.map((a) => {
    seen[a.source] = (seen[a.source] || 0) + 1;
    return totals[a.source] > 1 ? `${a.source} ${seen[a.source]}` : a.source;
  });
}

function briefingUrl(date, content) {
  return `${SITE_URL}/briefing/${date}?utm_source=newsletter&utm_medium=email&utm_campaign=daily_briefing&utm_content=${content}`;
}

// Same content and order as the /briefing page: dek, then each paragraph
// with its topic label and source links. Plain HTML - Buttondown's template
// wraps it and adds the unsubscribe footer itself.
function buildEmail(briefing) {
  const paragraphs = briefing.paragraphs.map((paragraph) => {
    const topic = paragraph.topic ? `<h3>${escapeHtml(paragraph.topic)}</h3>` : '';
    const labels = sourceLabels(paragraph.articles);
    const sources = paragraph.articles
      .map((a, i) => `<a href="${escapeHtml(a.url)}">${escapeHtml(labels[i])}</a>`)
      .join(', ');
    return `${topic}<p>${escapeHtml(paragraph.text)}</p>\n<p><small>Sources: ${sources}</small></p>`;
  }).join('\n');

  const body = [
    '<!-- buttondown-editor-mode: fancy -->',
    `<p><em>${escapeHtml(briefing.dek)}</em></p>`,
    paragraphs,
    '<hr>',
    `<p><a href="${briefingUrl(briefing.date, 'read_online')}">Read today's briefing on caption.news</a>` +
      ` · <a href="${SITE_URL}/?utm_source=newsletter&utm_medium=email&utm_campaign=daily_briefing&utm_content=headlines">Browse today's headlines</a></p>`,
    `<p><small>Written by AI from the ${escapeHtml(briefing.articleCount)} most relevant headlines on caption.news. ` +
      'It can make mistakes, so follow the source links for the full reporting.</small></p>',
  ].join('\n');

  return {
    subject: briefing.headline,
    body,
    description: briefing.dek,
    // Buttondown also publishes each email on a web archive page; this points
    // search engines back at the original briefing page.
    canonical_url: `${SITE_URL}/briefing/${briefing.date}`,
    image: `${SITE_URL}/og/briefing/${briefing.date}.png`,
  };
}

// An error the API definitely answered, so we know no email was created and
// it's safe to try again later. A timeout or network failure is NOT one of
// these: the email may or may not exist, so the caller must not retry blindly.
class ButtondownRejected extends Error {
  constructor(status, code, detail) {
    super(`Buttondown rejected the email (HTTP ${status}${code ? `, ${code}` : ''}): ${detail}`);
    this.status = status;
    this.code = code;
  }
}

// `status` is 'draft' (sits in the Buttondown dashboard, sent to nobody) or
// 'about_to_send' (goes to every subscriber right away). Returns the email id.
async function createEmail(email, status) {
  if (status !== 'draft' && status !== 'about_to_send') {
    throw new Error(`Refusing to create a Buttondown email with status "${status}"`);
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
      'X-API-Version': API_VERSION,
    },
    body: JSON.stringify({ ...email, status }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ButtondownRejected(response.status, data.code, data.detail || JSON.stringify(data).slice(0, 300));
  }
  return data.id;
}

module.exports = { buildEmail, createEmail, ButtondownRejected };
