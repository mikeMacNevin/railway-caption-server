# caption.news server

Node and Express API, plus a scraper worker. Both share one MySQL database. The branch is **`railway-test`**, never `master`. Every push deploys to Railway, so ask before pushing.

## Two processes, two Railway services, one repo

- **server**: `npm start` runs `server.js` on port 5000. It is read-only API traffic behind a rate limiter. It only reads what the worker has saved, and warms an in-memory cache hourly.
- **worker**: `npm run worker` runs `scrapeWorker.js`. All scheduled jobs live here (see the cron schedule in that file):
  - Scraping every 10 min. Front-page sites every cycle; the other sites in 6 rotating slices, so each site is fetched hourly.
  - Breaking-news check after each front-page scrape. It can rewrite the briefing early, at most once per 45 min.
  - Briefing every 3 h (`:20`), skipped if one was written in the last 150 min.
  - Category overviews from 6:40 to 12:40 ET. Later attempts only fill in failures.
  - Finance market update at 3pm ET on weekdays.
  - Bluesky daily post, attempted hourly 7–11am ET. Only the first success posts.
  - Retention: articles older than 7 days are pruned nightly at 3am.
  - IndexNow ping after each briefing or overview is written.

Environment variables are set **per service** in Railway. The Anthropic key and the Bluesky credentials (`BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD`) are on the worker only.

## Layout

- `routes/`: `articles.js` (`/api/articles/:page`, `/api/search`, `/api/debug` gated by `DEBUG_KEY`) and `summary.js` (`/api/summary`, `/summary/archive`, `/summary/:date`, `/summary/category/:page`)
- `scraper/`: `newsSites.js` is the source list (`page: 'home'` marks a front-page site). `diagnose.js` (`npm run diagnose`) checks broken sources.
- `summary/`: briefing (`generateSummary.js`), breaking news, category overviews and the market update. Models default to `claude-haiku-4-5`, overridable with `SUMMARY_MODEL` and `CATEGORY_SUMMARY_MODEL`.
- `social/`: `dailyPost.js` holds the platform-neutral "post today's briefing once" logic, and `bluesky.js` is the client. **New platforms (Threads, Mastodon, X) should add a client file and reuse `dailyPost.js` and the `social_posts` table under their own platform name.**
- `seo/indexNow.js`: the key must match `client/public/<key>.txt`.
- `db/`: one module per table. Schema changes run idempotently on boot (`ensure*` functions). There are no migration files.

## Running things by hand

`npm run summary`, `npm run summary:categories` and `npm run post:bluesky` run a single job locally against whatever DB `.env` points at. Be careful: that may be production.

## Debugging production

- No briefing or Bluesky post: check the worker logs for `Summary:`, `Breaking news:` and `Social:` lines.
- Missing headlines for a source: run `npm run diagnose`, then look at `newsSites.js`.
- There is no test suite (`npm test` is a placeholder).
