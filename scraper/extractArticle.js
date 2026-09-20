// Pulls one headline + link out of a fetched page, using a site's
// titleSelector / urlSelector from newsSites.js. Shared by the live scraper
// (scrapeWebsite.js) and the health check (diagnose.js) so they can never
// disagree about what counts as a working site.
//
// The important part is *pairing*. Taking the first title match and the
// first URL match independently (what this used to do) silently attaches one
// story's link to another story's headline whenever the first title and the
// first link belong to different cards - a nav link, a "Got a tip?" link, a
// section link, a video promo. So instead, for each title in page order we
// look for the link that belongs to the same card, and only ever return a
// title and URL that come from the same story.

const MAX_TITLES_TRIED = 25;

// A page's top slot is sometimes pinned to something old (a January
// explainer, a 2024 video). If a link carries a full date in its URL and that
// date is well in the past, it isn't a current headline - move on to the next
// one instead of showing it as today's top story.
const MAX_LINK_AGE_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

function isStaleUrl(href) {
  // /2026/01/12/ , 2026-01-12 , or a compact /20260112 in the URL.
  const full = href.match(/(20\d\d)[/-](\d{1,2})[/-](\d{1,2})(?!\d)/) || href.match(/\/(20\d\d)(\d\d)(\d\d)(?!\d)/);
  if (full) {
    const date = new Date(+full[1], +full[2] - 1, +full[3]);
    return Date.now() - date.getTime() > MAX_LINK_AGE_DAYS * DAY_MS;
  }
  // No full date - fall back to a year mentioned in the path, and only when
  // it is clearly last year or older ("/fall-tv-preview-2024", "/2024/05/").
  let path = href;
  try { path = new URL(href, 'https://placeholder.invalid').pathname; } catch (e) { /* use href as-is */ }
  const oldestFresh = new Date().getFullYear() - 1;
  for (const [, year] of path.matchAll(/(?:^|[^0-9])(20\d\d)(?![0-9])/g)) {
    if (+year < oldestFresh) return true;
  }
  return false;
}

// Titles that mean a selector latched onto page chrome, not a headline.
const JUNK_TITLES = /^(skip to (main )?content|menu|search|subscribe|sign in|log in|home|advertisement|newsletters?|more|read more|watch|listen|live|videos?|latest|trending|top stories|got a tip\??|ask rio times|see more|news|opinion)$/i;
const MIN_TITLE_LENGTH = 12;

function isUsableTitle(title) {
  return title.length >= MIN_TITLE_LENGTH && !JUNK_TITLES.test(title);
}


// Collapses runs of whitespace (including the newlines/indent that come from
// nested markup) into single spaces.
const clean = (text) => text.replace(/\s+/g, ' ').trim();

// Nested spans often concatenate with no space between them
// ("EXCLUSIVE" + "Princess Diana..." -> "EXCLUSIVEPrincess Diana..."), so put
// a space at every element boundary before reading the text, then collapse.
// Label elements that sit inside a headline's markup but aren't part of it.
const LABEL_CLASS = /(^|[\s_-])(kicker|eyebrow|exclusive|paywalled|sponsored|badge|byline|timestamp)([\s_-]|$)/i;

function titleText($, el) {
  const copy = $(el).clone();
  copy.find('[class]').filter((_, child) => LABEL_CLASS.test($(child).attr('class'))).remove();
  copy.find('br').replaceWith(' ');
  copy.find('*').each((_, child) => {
    $(child).append(' ').prepend(' ');
  });
  return clean(copy.text());
}

// The link that goes with this title element, or null.
function findPairedAnchor($, titleEl, site) {
  const $title = $(titleEl);

  // The title is inside the link (or is the link itself).
  const enclosing = $title.closest(site.urlSelector);
  if (enclosing.length && enclosing.attr('href')) return enclosing.first();

  // The link is inside the title.
  const inside = $title.find(site.urlSelector).first();
  if (inside.length && inside.attr('href')) return inside;

  // Otherwise the link is somewhere else in the same card. Walk outward from
  // the title until a wrapper holds a matching link - but stop as soon as a
  // wrapper holds a *second* title, since at that point it's a whole list of
  // cards and the first link in it could belong to any of them.
  for (const ancestor of $title.parents().toArray()) {
    const $ancestor = $(ancestor);
    if ($ancestor.find(site.titleSelector).length > 1) return null;
    const link = $ancestor.find(site.urlSelector).first();
    if (link.length && link.attr('href')) return link;
  }
  return null;
}

// Returns { title, href, matches } - `href` exactly as it appears in the
// page (relative or absolute) - or null if no title has a paired link.
// `matches` is how many title elements the selector found, for diagnostics.
function extractArticle($, site) {
  const titleEls = $(site.titleSelector).toArray();

  for (const titleEl of titleEls.slice(0, MAX_TITLES_TRIED)) {
    const title = titleText($, titleEl);
    if (!isUsableTitle(title)) continue;
    const anchor = findPairedAnchor($, titleEl, site);
    if (!anchor) continue;
    const href = anchor.attr('href').trim();
    if (/^(#|javascript:|mailto:)/i.test(href) || isStaleUrl(href)) continue;
    return { title, href, matches: titleEls.length };
  }
  return null;
}

module.exports = { extractArticle, titleText, isStaleUrl, isUsableTitle, JUNK_TITLES };
