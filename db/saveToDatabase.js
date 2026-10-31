require('dotenv').config();

const pool = require('./dbConfig');

// `articles.title` is VARCHAR(255). A longer headline used to make the whole
// insert fail, silently dropping the story - trim it instead.
const MAX_TITLE_LENGTH = 255;

// Same window the feeds read from (routes/articles.js). A story that comes
// back after dropping out of it is treated as new again.
const SAME_STORY_WINDOW_HOURS = 48;

function fitTitle(title) {
    return title.length <= MAX_TITLE_LENGTH ? title : title.slice(0, MAX_TITLE_LENGTH - 1).trimEnd() + '…';
}

// A site's top story usually stays put for several scrapes. Re-inserting it
// every time made created_at mean "last seen", so a five-hour-old lead
// looked brand new after every pass and real breaking news couldn't stand
// out. Instead, a link this site already has gets its last_seen_at (and
// title - sites retitle developing stories) refreshed, and created_at stays
// the moment it first appeared.
//
// Returns 'new' or 'seen' if the article was stored, false if not - so the
// caller can report how many sites made it in and how many headlines are new.
module.exports = async function saveToDatabase(article) {
    if (!article) return false;

    try {
        const title = fitTitle(article.title);
        const [[existing]] = await pool.execute(
            `SELECT id FROM articles
             WHERE page = ? AND source = ? AND url = ? AND last_seen_at > NOW() - INTERVAL ${SAME_STORY_WINDOW_HOURS} HOUR
             ORDER BY id DESC LIMIT 1`,
            [article.page, article.source, article.url]
        );

        if (existing) {
            await pool.execute('UPDATE articles SET last_seen_at = CURRENT_TIMESTAMP, title = ? WHERE id = ?', [title, existing.id]);
            return 'seen';
        }

        const query = 'INSERT INTO articles (title, url, source, site_icon_url, website, page) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.execute(query, [title, article.url, article.source, article.site_icon_url, article.website, article.page]);
        console.log(`Saved article from ${article.source}: ${article.title}`);
        return 'new';
    } catch (error) {
        // The usual cause: a link longer than the url column allows. See
        // ensureArticlesSchema in db/articlesSchema.js.
        console.error(`Error saving to database for ${article.source} (${error.code || 'unknown'}):`, error.message);
        return false;
    }
}
