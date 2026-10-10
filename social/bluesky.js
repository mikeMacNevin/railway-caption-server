// Shares a briefing on Bluesky as one post: headline, the one-line dek, a
// short clickable link label, and a link preview card with the briefing's
// share image.
//
// Bluesky does less for you than X: links in the text are plain text unless
// the post carries a "facet" marking their byte range, and link cards are
// never fetched automatically - the poster has to upload the image and attach
// the card itself. Both are handled here.
//
// Needs BLUESKY_HANDLE (e.g. caption.news) and BLUESKY_APP_PASSWORD - an app
// password from Bluesky's settings, never the account's real password.
const { AtpAgent } = require('@atproto/api');

const SITE_URL = 'https://www.caption.news';
const BLUESKY_SERVICE = 'https://bsky.social';
const MAX_GRAPHEMES = 300; // Bluesky's post length limit
const MAX_IMAGE_BYTES = 1000000; // Bluesky's blob limit for an embed thumbnail

// Shown in the text; links to the full (tracked) URL via a facet, so the
// long utm query string doesn't eat into the 300-character limit.
const LINK_LABEL = 'caption.news/briefing';

function briefingUrl(date) {
  return `${SITE_URL}/briefing/${date}?utm_source=bluesky&utm_medium=social&utm_campaign=daily_briefing`;
}

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
function graphemes(text) {
  return [...segmenter.segment(text)].map((s) => s.segment);
}

function truncate(text, max) {
  const chars = graphemes(text);
  if (chars.length <= max) return text;
  return chars.slice(0, Math.max(0, max - 1)).join('').trimEnd() + '…';
}

// Builds the post text, trimming the dek (then, if ever needed, the
// headline) so the whole thing fits in 300 graphemes. Exported for --dry.
function buildPostText(briefing) {
  const suffix = `\n\n${LINK_LABEL}`;
  const budget = MAX_GRAPHEMES - graphemes(suffix).length;

  const headline = truncate(briefing.headline, budget);
  const remaining = budget - graphemes(headline).length - 2; // 2 = "\n\n"
  const dek = remaining > 20 ? truncate(briefing.dek, remaining) : '';

  return (dek ? `${headline}\n\n${dek}` : headline) + suffix;
}

// Facet offsets are UTF-8 byte offsets, not character offsets.
function linkFacet(text, label, uri) {
  const start = Buffer.byteLength(text.slice(0, text.lastIndexOf(label)), 'utf8');
  return {
    index: { byteStart: start, byteEnd: start + Buffer.byteLength(label, 'utf8') },
    features: [{ $type: 'app.bsky.richtext.facet#link', uri }],
  };
}

// The card still posts without a thumbnail if the image can't be fetched -
// a missing picture isn't worth losing the whole day's post over.
async function uploadThumb(agent, date) {
  try {
    const res = await fetch(`${SITE_URL}/og/briefing/${date}.png`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.length > MAX_IMAGE_BYTES) throw new Error(`image is ${bytes.length} bytes`);
    const { data } = await agent.uploadBlob(bytes, { encoding: res.headers.get('content-type') || 'image/png' });
    return data.blob;
  } catch (err) {
    console.error(`Bluesky: share image unavailable (${err.message}), posting card without it`);
    return undefined;
  }
}

async function postBriefingToBluesky(briefing) {
  const identifier = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error('BLUESKY_HANDLE / BLUESKY_APP_PASSWORD not set');
  }

  const agent = new AtpAgent({ service: BLUESKY_SERVICE });
  await agent.login({ identifier, password });

  const url = briefingUrl(briefing.date);
  const text = buildPostText(briefing);
  const thumb = await uploadThumb(agent, briefing.date);

  const { uri } = await agent.post({
    text,
    facets: [linkFacet(text, LINK_LABEL, url)],
    langs: ['en'],
    createdAt: new Date().toISOString(),
    embed: {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title: briefing.headline,
        description: briefing.dek,
        ...(thumb && { thumb }),
      },
    },
  });
  return uri;
}

module.exports = { postBriefingToBluesky, buildPostText, briefingUrl };
