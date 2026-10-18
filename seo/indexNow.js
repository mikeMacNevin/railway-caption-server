// Tells search engines about new or updated pages the moment they change,
// instead of waiting for their next crawl. One IndexNow submission reaches
// Bing, Yandex, Seznam, Naver and the other participating engines (Google
// doesn't take part - it finds new briefings through the sitemap).
//
// IndexNow proves we own the site by fetching the key file from the site
// itself: the client serves it from client/public/<KEY>.txt, and that file's
// contents must stay identical to KEY below. The key isn't a secret.
const SITE_URL = 'https://www.caption.news';
const KEY = 'd1ec29a1aa9d9a68c1353668005d4862';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const TIMEOUT_MS = 15000;

// Submits paths like '/briefing/2026-10-17'. Never throws - a failed ping
// only means the engines find the change on their next crawl instead, so it
// is logged and the caller carries on.
async function submitToIndexNow(paths) {
  if (!paths.length) return;
  const urlList = paths.map((p) => `${SITE_URL}${p}`);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // 200 = accepted, 202 = accepted but the key file hasn't been checked yet.
    if (res.ok) {
      console.log(`IndexNow: submitted ${urlList.length} URL(s) (HTTP ${res.status})`);
    } else {
      console.warn(`IndexNow: HTTP ${res.status} for ${urlList.join(', ')} - ${(await res.text()).slice(0, 200)}`);
    }
  } catch (err) {
    console.warn('IndexNow ping failed:', err.message);
  }
}

module.exports = { submitToIndexNow, KEY };
