require('dotenv').config();

const pool = require('./dbConfig');

// `articles.title` is VARCHAR(255). A longer headline used to make the whole
// insert fail, silently dropping the story - trim it instead.
const MAX_TITLE_LENGTH = 255;

function fitTitle(title) {
    return title.length <= MAX_TITLE_LENGTH ? title : title.slice(0, MAX_TITLE_LENGTH - 1).trimEnd() + '…';
}

// Returns true if the article was stored, false if not - so the caller can
// report how many sites actually made it into the database.
module.exports = async function saveToDatabase(article) {
    if (!article) return false;

    try {
        const query = 'INSERT INTO articles (title, url, source, site_icon_url, website, page) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.execute(query, [fitTitle(article.title), article.url, article.source, article.site_icon_url, article.website, article.page]);
        console.log(`Saved article from ${article.source}: ${article.title}`);
        return true;
    } catch (error) {
        // The usual cause: a link longer than the url column allows. See
        // ensureArticlesSchema in db/articlesSchema.js.
        console.error(`Error saving to database for ${article.source} (${error.code || 'unknown'}):`, error.message);
        return false;
    }
}
